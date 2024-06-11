import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { nftMarketAddress, nftAddress } from '../config'
import Web3Modal from 'web3modal'
import Script from 'next/script'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import NFTMarket from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import { useRouter } from 'next/router'

export default function Salesroom() {
    const [nfts, setNFT] = useState([])
    const [bidInput, setBidInput] = useState({ bid: '0' })
    const [loadingState, setLoadingState] = useState('not-loaded')

    const router = useRouter()

    useEffect(() => {
        loadNFTs()
    }, [])

    async function loadNFTs() {
        const provider = new ethers.providers.JsonRpcProvider();
        const NFTContract = new ethers.Contract(nftAddress, NFT.abi, provider);
        const MarketContract = new ethers.Contract(nftMarketAddress, NFTMarket.abi, provider);

        const [_, curTokenId] = router.asPath.split("=");

        const tokenDetail = await MarketContract.getTokenDetail(curTokenId);
        // const auctionDetail = await MarketContract.getAuctionDetail(curTokenId);

        const price = ethers.utils.formatUnits(tokenDetail.price, 'ether');
        const tokenUri = await NFTContract.tokenURI(tokenDetail.tokenId);
        const meta = await axios.get(tokenUri);

        let item = {
            price: price,
            tokenId: tokenDetail.tokenId.toNumber(),
            seller: tokenDetail.seller,
            image: meta.data.image,
            name: meta.data.name,
            creater: tokenDetail.creater,
            url: tokenUri,
            description: meta.data.description,
        };

        setNFT(item);
        setLoadingState('loaded');
    }

    // 执行购买操作
    async function buyNFT(nft) {
        const web3Modal = new Web3Modal()
        const connect = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connect)
        // signer: 当前用户
        const signer = provider.getSigner()
        const account = await signer.getAddress()
        if (nft.seller === account) {
            alert('你不能购买自己发布的NFT')
            return
        }
        const MarketContract = new ethers.Contract(nftMarketAddress, NFTMarket.abi, signer)
        const price = ethers.utils.parseUnits(nft.price, 'ether')
        const transaction = await MarketContract.createMarketSale(nft.tokenId, nftAddress, {
            value: price
        })
        await transaction.wait()
        router.push('/my-nfts')
    }

    if (loadingState !== 'loaded') return (
        <main>
            <div className='container row-cols-1 mt-5 mb-5'>
                <div className='col'>
                    <div className="sp sp-hydrogen"></div>
                </div>
            </div>
        </main>
    )

    return (
        <div>
            <div className='container'>
                <div className='row'>
                    <div className='col col-12 text-center mt-3 mb-3'>
                        <span className='fs-2 me-4 align-middle fw-bolder'>NFT</span>
                        <img src={'/img/nftSysbom.png'} className="img tokenImg" />
                        <span className='fs-2 ms-4 align-middle fw-bolder'>详情</span>
                    </div>
                    <div className='col col-12 text-center mb-5 align-self-center'>
                        <img src={nfts.image} className="img-fluid img-thumbnail anime-img-preview  w-25 h-25" alt="..." />
                    </div>
                    <div className='col col-12 text-center'>
                        <div className='row'>
                            <div className='col col-6 col-md-4 border-end border-bottom border-info'><p className='fw-bolder'>NFT编号</p># {nfts.tokenId}</div>
                            <div className='col col-6 col-md-4 border-end border-bottom border-info pb-3'><p className='fw-bolder'>NFT名称</p><span>{nfts.name}</span></div>
                            <div className='col col-6 col-md-4  border-bottom border-info'><p className='fw-bolder'>NFT价格</p>{nfts.price} ETH</div>
                            <div className='col col-6 col-md-4 overflow-hidden highestBidder border-end border-bottom border-info pb-3'><p className='fw-bolder'>创建者</p>{nfts.creater}</div>
                            <div className='col col-6 col-md-4 border-end border-bottom border-info'><p className='fw-bolder'>出售者</p>{nfts.seller}</div>
                            <div className='col col-6 col-md-4 overflow-hidden highestBidder border-bottom border-info pb-3'><p className='fw-bolder'>NFT元数据</p><a href={nfts.url} class="text-decoration-none">{nfts.url}</a></div>
                        </div>
                    </div>
                    <div className='col col-12 mt-3 text-center'>
                        <button type="button" className="btn btn-primary w-25" onClick={() => buyNFT(nfts)}>购买</button>
                    </div>
                    <div className='col col-12 mt-3'>
                        <p className="input-group-text fw-bolder m-0">商品描述</p>
                        <div className='border p-2'>{nfts.description}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}