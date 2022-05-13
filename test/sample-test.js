const { ethers } = require("hardhat");

getItemsOfTrade = async (item, nft) => {
  let items = []
  await Promise.all(item.map(async i => {
    // tokenURI: ERC721URIStorage内部方法根据token的id查询uri
    const tokenUri = await nft.tokenURI(i.tokenId)   
    let item = {
      price: i.price.toString(),
      tokenId: i.tokenId.toString(),
      seller: i.seller,
      owner: i.owner,
      creater: i.creater,
      tokenUri
    }
    items.push(item)
  }))
  return items;
}

getItemsOfAuction = async (item, nft, market) => {
  let items = []
  await Promise.all(item.map(async i => {
    // tokenURI: ERC721URIStorage内部方法根据token的id查询uri
    const tokenUri = await nft.tokenURI(i.tokenId)
    const auctionDetail = await market.getAuctionDetail(i.itemId)
    let item = {
      price: i.price.toString(),
      tokenId: i.tokenId.toString(),
      seller: i.seller,
      owner: i.owner,
      creater: i.creater,
      auctionDetail: {
        endAt: auctionDetail.endAt,
        highestBid: auctionDetail.highestBid,      
        started: auctionDetail.started,
        ended: auctionDetail.ended,
        highestBidder: auctionDetail.highestBidder,
      },
      tokenUri
    }
    items.push(item)
  }))
  return items;
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

describe("NFTMarket", function () {
  it("Should mint and trade NFTs", async function () {
    // 测试合约部署
    const Market = await ethers.getContractFactory('NFTMarket')
    const market = await Market.deploy()
    await market.deployed()
    const marketAddress = market.address

    const NFT = await ethers.getContractFactory('NFT')
    const nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    const nftAddress = nft.address

    // 测试获取手续费价格和价格
    let listingPrice = await market.listingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = await ethers.utils.parseUnits('100', 'ether')

    // 测试铸币功能
    await nft.mintToken('https-t1')
    await nft.mintToken('https-t2')

    // 导入物品
    await market.addMarketItem(1, nftAddress)
    await market.addMarketItem(2, nftAddress)

    let item = await market.getMyToken()

    itemsList = await getItemsOfTrade(item, nft)

    console.log('myItem', itemsList)

    console.log("添加物品测试成功")

    // 上架物品
    await market.makeMarketItem(1, auctionPrice, nftAddress, { value: listingPrice })
    await market.makeMarketItem(2, auctionPrice, nftAddress, { value: listingPrice })

    console.log("上架测试成功")

    item = await market.getEnableSellToken()
    itemsList = await getItemsOfTrade(item, nft)

    console.log('UnsoldItem', itemsList)

    // 测试交易功能
    const [_, buyer] = await ethers.getSigners()

    await market.connect(buyer).createMarketSale(1, nftAddress, { value: auctionPrice })

    console.log("交易测试成功")

    item = await market.getEnableSellToken()

    itemsList = await getItemsOfTrade(item, nft)

    console.log('UnsoldItem', itemsList)

    // 测试转卖物品
    await nft.connect(buyer).setApprovalForAll(marketAddress, true)
    await market.connect(buyer).makeMarketItem(1, auctionPrice, nftAddress, { value: listingPrice })

    console.log("转卖测试成功")

    item = await market.getEnableSellToken()

    itemsList = await getItemsOfTrade(item, nft)

    console.log('UnsoldTokenItem', itemsList)
  })

  it("Should mint and auction NFTs", async function () {
    // 测试合约部署
    const Market = await ethers.getContractFactory('NFTMarket')
    const market = await Market.deploy()
    await market.deployed()
    const marketAddress = market.address

    const NFT = await ethers.getContractFactory('NFT')
    const nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    const nftAddress = nft.address

    // 测试获取手续费价格和价格
    let listingPrice = await market.listingPrice()
    listingPrice = listingPrice.toString()

    // 测试铸币功能
    await nft.mintToken('https-t1')
    await nft.mintToken('https-t2')

    // 导入物品
    await market.addMarketItem(1, nftAddress)
    await market.addMarketItem(2, nftAddress)

    console.log("添加物品测试成功")

    // 测试开始拍卖功能
    await market.auctionStart(1, 120, nftAddress, 5, { value: listingPrice })
    await market.auctionStart(2, 130, nftAddress, 6, { value: listingPrice })

    let item = await market.getTokenAtAuction()
    itemsList = await getItemsOfAuction(item, nft, market)

    console.log('AuctionTokenItem', itemsList)

    console.log("开始拍卖测试成功")

    // 测试出价
    const [_, buyer1, buyer2] = await ethers.getSigners()
    await market.connect(buyer1).auctionBid(1, {value: 124})

    item = await market.getAuctionDetail(1)

    console.log('AuctionBidTokenItem-01', item)

    await market.connect(buyer2).auctionBid(1, {value: 125})

    item = await market.getAuctionDetail(1)

    console.log('AuctionBidTokenItem-02', item)

    await market.connect(buyer2).auctionBid(2, {value: 131})

    item = await market.getAuctionDetail(2)

    console.log('AuctionBidTokenItem-03', item)

    console.log("拍卖出价测试成功")

    sleep(70000);

    // 测试结束拍卖
    await market.auctionEnd(1, nftAddress)
    await market.auctionEnd(2, nftAddress)

    item = await market.getTokenAtAuction()
    itemsList = await getItemsOfAuction(item, nft, market)

    console.log('AuctionEndTokenItem', itemsList)

    item = await market.connect(buyer2).getMyToken()
    itemsList = await getItemsOfTrade(item, nft)

    console.log('buyer2-Item', itemsList)

    console.log("结束拍卖测试成功")
  })
});
