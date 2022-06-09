// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// ReentrancyGuard: 针对多请求安全性,防止重入攻击

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    Counters.Counter private _auctionIds;

    address payable owner;

    // 商品上架手续费
    uint256 public listingPrice = 0.045 ether;

    constructor() {
        owner = payable(msg.sender);
    }

    struct MarketItem {
        uint256 itemId;
        uint256 price;
        uint256 tokenId;
        address nftAddress;
        address payable owner;
        address payable seller;
        address creater;
        bool enableSell;
        bool isAuction;
    }

    struct AuctionItem {
        uint256 itemId;
        uint256 endAt; 
        uint256  highestBid;       
        bool started;
        bool ended;
        address payable highestBidder;
    }

    mapping(uint256 => MarketItem) private idToTokenItem;   
    mapping(uint256 => AuctionItem) private idToAuctionItem;

    event MarketTokenMinted(
        uint256 indexed itemId,
        uint256 price,
        uint256 indexed tokenId,
        address indexed nftAddress,
        address owner,
        address seller,
        address creater,
        bool enableSell
    );
    event Start();
    event Bid(address indexed sender, uint amount);
    event Withdraw(address indexed bidder, uint amount);
    event End(address winner, uint amount);

    // 将nft从nft合约导入到市场合约
    function addMarketItem(
        uint256 tokenId, 
        address nftAddress
    ) public payable nonReentrant {
         _tokenIds.increment();
        uint256 itemId = _tokenIds.current();
        idToTokenItem[itemId] = MarketItem(
            itemId,
            0,
            tokenId,
            nftAddress,
            payable(msg.sender),
            payable(address(0)),
            msg.sender,
            false,
            false
        );
    }

    // 一般交易部分===================================================================================

    // 上架物品
    function makeMarketItem(
        uint256 itemId,
        uint256 price,
        address nftAddress
    ) public payable {
        require(price > 0, "Price must be at least one wei");
        require(
            msg.value == listingPrice,
            "Send value must be equal to listing price"
        );
        uint256 tokenId = idToTokenItem[itemId].tokenId;
        idToTokenItem[itemId].price = price;
        idToTokenItem[itemId].owner = payable(address(0));
        idToTokenItem[itemId].seller = payable(msg.sender);
        idToTokenItem[itemId].enableSell = true;
        // 授权市场托管NFT
        // 因为在NFT合约中的铸币过程中已经调用了setApprovalForAll方法授权marketPlaceAddress
        // 所以在此无需调用
        IERC721(nftAddress).transferFrom(msg.sender, address(this), tokenId);

        emit MarketTokenMinted(
            itemId,
            price,
            tokenId,
            nftAddress,
            payable(address(0)),
            payable(msg.sender),
            msg.sender,
            true
        );
    }

    // 下架物品
    function removeMarketItem(
        uint256 itemId,
        address nftAddress
    ) public {
        require(idToTokenItem[itemId].seller == msg.sender || owner == msg.sender, 'permission denied');
        uint256 tokenId = idToTokenItem[itemId].tokenId;
        idToTokenItem[itemId].price = 0;
        idToTokenItem[itemId].owner = payable(msg.sender);
        idToTokenItem[itemId].seller = payable(address(0));
        idToTokenItem[itemId].enableSell = false;

        IERC721(nftAddress).transferFrom(address(this), msg.sender,  tokenId);
        payable(msg.sender).transfer(listingPrice);
    }

    // 交易物品
    function createMarketSale(
        uint256 itemId, 
        address nftAddress
    )
        public
        payable
        nonReentrant
    {
        uint256 price = idToTokenItem[itemId].price;
        require(msg.value == price, "Send value must be equal to token price");
        uint256 tokenId = idToTokenItem[itemId].tokenId;
        // 将钱转给售卖者
        idToTokenItem[itemId].seller.transfer(msg.value);
        // 调用者依然是在nftAddress已经授权的marketPlaceAddress
        IERC721(nftAddress).transferFrom(address(this), msg.sender, tokenId);
        idToTokenItem[itemId].owner = payable(msg.sender);
        idToTokenItem[itemId].enableSell = false;
        // 支付手续费
        payable(owner).transfer(listingPrice);
    }

    // 获取未卖出商品
    function getEnableSellToken() public view returns(MarketItem[] memory) {
        uint itemCount = _tokenIds.current();
        uint unsoldItemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < itemCount; i++) {
            if (idToTokenItem[i + 1].enableSell) {
                unsoldItemCount++;
            }
        }
        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for(uint i = 0; i < itemCount; i++) {
            if(idToTokenItem[i + 1].enableSell) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToTokenItem[currentId];
                items[currentIndex] = currentItem; 
                currentIndex += 1;
            }
        } 
        return items; 
    }

    // 获取我拥有的商品
    function getMyToken() public view returns (MarketItem[] memory) {
        uint256 itemCount = _tokenIds.current();
        uint256 myCount = 0;
        uint256 currentIndex = 0;

        for (uint i = 0; i < itemCount; i++) {
            if (idToTokenItem[i + 1].owner == msg.sender) {
                myCount++;
            }
        }
        MarketItem[] memory items = new MarketItem[](myCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToTokenItem[i + 1].owner == msg.sender) {
                uint256 currentId = idToTokenItem[i + 1].itemId;
                MarketItem storage currentItem = idToTokenItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex++;
            }
        }
        return items;
    }

    // 获取我正在售卖的商品
     function getMySellToken() public view returns (MarketItem[] memory) {
        uint256 itemCount = _tokenIds.current();
        uint256 myCount = 0;
        uint256 currentIndex = 0;

        for (uint i = 0; i < itemCount; i++) {
             if (idToTokenItem[i + 1].seller == msg.sender && !idToTokenItem[i + 1].isAuction && idToTokenItem[i + 1].enableSell) {
                 myCount++;
            }
        }
         MarketItem[] memory items = new MarketItem[](myCount);
         for (uint256 i = 0; i < itemCount; i++) {
             if (idToTokenItem[i + 1].seller == msg.sender && !idToTokenItem[i + 1].isAuction && idToTokenItem[i + 1].enableSell) {
                 uint256 currentId = idToTokenItem[i + 1].itemId;
                     MarketItem storage currentItem = idToTokenItem[currentId];
                     items[currentIndex] = currentItem;
                 currentIndex++;
             }
         }
         return items;
     }

    // 获取我铸造的nft
    function getMySellingToken() public view returns (MarketItem[] memory) {
        uint256 itemCount = _tokenIds.current();
        uint256 myCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < itemCount; i++) {
            if (idToTokenItem[i + 1].creater == msg.sender) {
                myCount++;
            }
        }
        MarketItem[] memory items = new MarketItem[](myCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToTokenItem[i + 1].creater == msg.sender) {
                uint256 currentId = idToTokenItem[i + 1].itemId;
                MarketItem storage currentItem = idToTokenItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex++;
            }
        }
        return items;
    }

    // 根据ID获取物品信息
    function getTokenDetail(uint itemId) public view returns (MarketItem memory) {
        return idToTokenItem[itemId];
    }

    // 拍卖部分=====================================================================================================

    // 开始拍卖
    function auctionStart(
        uint itemId,
        uint256 price,
        address nftAddress,
        uint times
    ) external nonReentrant payable{ 
        require(price >= 0, "start auction amount must be greater than 0");
        require(
            msg.value == listingPrice,
            "Send value must be equal to listing price"
        );
        _auctionIds.increment();
        idToTokenItem[itemId].price = price;
        idToTokenItem[itemId].owner = payable(address(0));
        idToTokenItem[itemId].seller = payable(msg.sender);
        idToTokenItem[itemId].isAuction = true;
        uint256 tokenId = idToTokenItem[itemId].tokenId;

        // 授权市场托管NFT
        IERC721(nftAddress).transferFrom(msg.sender, address(this), tokenId);

        idToAuctionItem[itemId].itemId = _auctionIds.current();
        idToAuctionItem[itemId].highestBid = price;
        idToAuctionItem[itemId].started = true;
        idToAuctionItem[itemId].endAt = block.timestamp + times;

        emit Start();
    }

    // 拍卖出价
    function auctionBid(uint itemId) external payable nonReentrant{
        require(msg.sender != idToTokenItem[itemId].seller, "seller shall not bid");
        require(idToAuctionItem[itemId].started, "not started");  
        require(block.timestamp < idToAuctionItem[itemId].endAt, "auction already ended");
        require(msg.value > idToAuctionItem[itemId].highestBid, "auction amount must be greater than highestBid");

        if (idToAuctionItem[itemId].highestBidder != address(0)) {
            // 如果有最高出价者, 则将前一个最高出价者的钱退还
            payable (idToAuctionItem[itemId].highestBidder).transfer(idToAuctionItem[itemId].highestBid);
        }

        idToAuctionItem[itemId].highestBidder = payable(msg.sender);
        idToAuctionItem[itemId].highestBid = msg.value;

        emit Bid(msg.sender, msg.value);
    }

    // 拍卖结束
    function auctionEnd(uint itemId, address nftAddress) external nonReentrant{
        require(msg.sender == idToTokenItem[itemId].seller, "only seller can to end");
        require(idToAuctionItem[itemId].started, "auction not started");
        require(block.timestamp >= idToAuctionItem[itemId].endAt, "auction not ended");
        require(!idToAuctionItem[itemId].ended, "auction already ended");

        if (idToAuctionItem[itemId].highestBidder != address(0)) {
            IERC721(nftAddress).transferFrom(address(this), idToAuctionItem[itemId].highestBidder, idToTokenItem[itemId].tokenId);
            idToTokenItem[itemId].seller.transfer(idToAuctionItem[itemId].highestBid);
            idToTokenItem[itemId].owner = payable(idToAuctionItem[itemId].highestBidder);
        } else {
            IERC721(nftAddress).transferFrom(address(this), idToTokenItem[itemId].seller, idToTokenItem[itemId].tokenId);
            idToTokenItem[itemId].seller.transfer(listingPrice);
            idToTokenItem[itemId].owner = payable(idToTokenItem[itemId].seller);
            idToTokenItem[itemId].seller = payable(address(0));
        }

        idToAuctionItem[itemId].ended = true;
        idToTokenItem[itemId].isAuction = false;
        delete idToAuctionItem[itemId];
        _auctionIds.decrement();
        emit End(idToAuctionItem[itemId].highestBidder, idToAuctionItem[itemId].highestBid);
    }

    // 获取拍卖中的的nft
    function getTokenAtAuction() public view returns (MarketItem[] memory) {
        uint256 itemCount = _tokenIds.current();
        uint256 myCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < itemCount; i++) {
            if (idToTokenItem[i + 1].isAuction) {
                myCount++;
            }
        }
        MarketItem[] memory items = new MarketItem[](myCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToTokenItem[i + 1].isAuction) {
                uint256 currentId = idToTokenItem[i + 1].itemId;
                MarketItem storage currentItem = idToTokenItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex++;
            }
        }
        return items;
    }

    // 获取我拍卖中的的nft
    function getMyTokenAtAuction() public view returns (MarketItem[] memory) {
        uint256 itemCount = _tokenIds.current();
        uint256 myCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < itemCount; i++) {
            if (idToTokenItem[i + 1].isAuction && idToTokenItem[i + 1].seller == msg.sender) {
                myCount++;
            }
        }
        MarketItem[] memory items = new MarketItem[](myCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToTokenItem[i + 1].isAuction && idToTokenItem[i + 1].seller == msg.sender) {
                uint256 currentId = idToTokenItem[i + 1].itemId;
                MarketItem storage currentItem = idToTokenItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex++;
            }
        }
        return items;
    }

    // 获取拍卖详情
    function getAuctionDetail(uint itemId) public view returns (AuctionItem memory) {
        return idToAuctionItem[itemId];
    }
}
