import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Web3Modal from 'web3modal'
import { nftMarketAddress, nftAddress } from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import NFTMarket from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

const UserOffcanva = () => {
  return (
    <div>
      <div className='container mt-3 pb-3 border-bottom'>
        <button className="btn btn-lg btn-outline-primary border-0 iconfont" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
          &#xe612; 切换
        </button>
      </div>
      <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasExampleLabel">切换</h5>
          <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <div>
            <Link href='/my-nfts'>
              <button type="button" className="dropdown-item btn-lg mb-3" data-bs-dismiss="offcanvas">我的NFT</button>
            </Link>
          </div>
          <div>
            <Link href='/my-sell-nfts'>
              <button type="button" className="dropdown-item btn-lg mb-3" data-bs-dismiss="offcanvas">我的出售</button>
            </Link>
          </div>
          <div>
            <Link href='/mu-auction-nfts'>
              <button type="button" className="dropdown-item btn-lg" data-bs-dismiss="offcanvas">我的拍卖</button>
            </Link>
          </div>
        </div>
        <img src={'/img/infrastructure_transparent.png'} className="card-img-top img center-block" />
      </div>
    </div>
  )
}

export default function MyAuctionNft() {
  const [nfts, setNFts] = useState([])
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
    const MarketContract = new ethers.Contract(nftMarketAddress, NFTMarket.abi, singer)
    const data = await MarketContract.getMyTokenAtAuction()

    let items = await Promise.all(data.map(async i => {
      const tokenUri = await NFTContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      const price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price: price,
        tokenId: i.tokenId.toNumber(),
        image: meta.data.image,
        name: meta.data.name,
      }
      return item
    }))
    setNFts(items)
    setLoadingState('loaded')
  }

  async function auctionEnd(nft) {
    const web3Modal = new Web3Modal()
    const connect = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connect)
    // signer: 当前用户
    const signer = provider.getSigner()
    const MarketContract = new ethers.Contract(nftMarketAddress, NFTMarket.abi, signer)

    setLoadingState('not-loaded')
    const transaction = await MarketContract.auctionEnd(nft.tokenId, nftAddress)
    await transaction.wait()
    setLoadingState('loaded')
    loadNFTs()
  }

  if (loadingState === 'loaded' && !nfts.length) return (
    <div>
      <UserOffcanva />
      <main className="flex-shrink-0">
        <div className="container">
          <h1 className="mt-5">你目前没有拍卖任何NFT</h1>
          <p className="lead">暂无记录</p>
          <p>点击前往 <a href="/market">交易所</a> 或前往 <a href="/">主页</a></p>
        </div>
      </main>
    </div>
  )
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
      <UserOffcanva />
      <div className='container mt-3'>
        <div className='row g-4 row-cols-md-4 row-cols-lg-4 row-cols-xl-4'>
          {
            // 循环现有nft并在页面展示
            nfts.map((nft, i) => (
              <div className='col-md'>
                <div key={i} className="card h-100">
                  <Link href={`/salesroom?tokenId=${nft.tokenId}`}>
                    <img src={nft.image} className="card-img-top" />
                  </Link>
                  <div className="card-body">
                    <h5 className="card-title mb-2">{nft.name}</h5>

                    <a
                      className="btn btn-danger w-100"
                      role="button"
                      onClick={() => auctionEnd(nft)}
                    >结束拍卖</a>
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
