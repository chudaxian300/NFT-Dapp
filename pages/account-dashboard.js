import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { nftMarketAddress, nftAddress } from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import KBMarket from '../artifacts/contracts/KBMarket.sol/KBMarket.json'

export default function AccountDashBoard() {
    const [nfts, setNFts] = useState([])
    const [sold, setSold] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')

    useEffect(() => {
        loadNFTs()
    }, [])

    async function loadNFTs() {
        const web3Modal = new Web3Modal()
        const connect = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connect)
        const singer = provider.getSigner()
        const NFTContract = new ethers.Contract(nftAddress, NFT.abi, provider)
        const MarketContract = new ethers.Contract(nftMarketAddress, KBMarket.abi, singer)
        const data = await MarketContract.getMySellingToken()

        let items = await Promise.all(data.map(async i => {
            const tokenUri = await NFTContract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            const price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                price: price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.data.image,
                name: meta.data.name,
                description: meta.data.description
            }
            return item
        }))
        const soldItem = setSold(items.filter(i => i.sold))
        setSold(soldItem)
        setNFts(items)
        setLoadingState('loaded')
    }

    if (loadingState === 'loaded' && !nfts.length) return (
        <main className="flex-shrink-0">
            <div className="container">
                <h1 className="mt-5">你没有铸造任何NFT</h1>
                <p className="lead">赶紧去铸造NFT吧</p>
                <p>点击前往 <a href="/mint-item">铸造页面</a> 或前往 <a href="/">主页</a></p>
            </div>
        </main>
    )

    return (
        <div>
            <div className='container mt-3'>
                <button className="btn btn-lg btn-outline-primary border-0 iconfont" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                    &#xe64f; 筛选
                </button>
            </div>
            <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasExampleLabel">筛选NFT</h5>
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <div>
                        Some text as placeholder. In real life you can have the elements you have chosen. Like, text, images, lists, etc.
                    </div>
                    <div className="dropdown mt-3">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown">
                            Dropdown button
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <li><a className="dropdown-item" href="#">Action</a></li>
                            <li><a className="dropdown-item" href="#">Another action</a></li>
                            <li><a className="dropdown-item" href="#">Something else here</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className='container mt-2'>
                <div className='row g-4 row-cols-md-4 row-cols-lg-4 row-cols-xl-4'>
                    {
                        // 循环现有nft并在页面展示
                        nfts.map((nft, i) => (
                            <div className='col-md'>
                                <div key={i} className="card h-100">
                                    <img src={nft.image} className="card-img-top" alt="..." />
                                    <div className="card-body">
                                        <h5 className="card-title mb-2">{nft.name}</h5>
                                        <p className="card-text mb-1">{nft.description}</p>
                                        <p className="card-text mb-3 iconfont">&#xe67b; {nft.price} ETH</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
