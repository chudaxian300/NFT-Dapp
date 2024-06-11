import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { nftMarketAddress, nftAddress } from '../config'
import Web3Modal from 'web3modal'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import NFTMarket from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import { useRouter } from 'next/router'

const MarketOffcanva = () => {
  return (
    <div>
      <div className='container mt-3 pb-3 border-bottom'>
        <button className="btn btn-lg btn-outline-primary border-0 iconfont" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
          &#xe612; 市场切换
        </button>
      </div>
      <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasExampleLabel">市场切换</h5>
          <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <div>
            <Link href='/market'>
              <button type="button" className="dropdown-item btn-lg mb-3" data-bs-dismiss="offcanvas">交易所</button>
            </Link>
          </div>
          <div>
            <Link href='/auctionMarket'>
              <button type="button" className="dropdown-item btn-lg" data-bs-dismiss="offcanvas">拍卖场</button>
            </Link>
          </div>
        </div>
        <img src={'/img/eth.webp'} className="card-img-top img center-block" />
      </div>
    </div>
  )
}


export default function AuctionMarket() {
  const [nfts, setNFts] = useState([])
  const [admin, setAdmin] = useState(false)
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    loadNFTs()
  }, [])

  // 加载可拍卖NFT
  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider()
    const MetaMaskProvider = new ethers.providers.Web3Provider(window.ethereum);
    const NFTContract = new ethers.Contract(nftAddress, NFT.abi, provider)
    const MarketContract = new ethers.Contract(nftMarketAddress, NFTMarket.abi, provider)

    const owner = await MarketContract.getOwner()
    const user = await MetaMaskProvider.getSigner().getAddress()
    setAdmin(owner == user)

    const data = await MarketContract.getTokenAtAuction()
    let items = await Promise.all(data.map(async i => {
      const tokenUri = await NFTContract.tokenURI(i.tokenId)
      // 使用获取NFT图片，名称，描述信息
      const meta = await axios.get(tokenUri)
      const price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price: price,
        tokenId: i.tokenId.toNumber(),
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    setNFts(items)
    setLoadingState('loaded')
  }

  // 管理员下架NFT
  async function removeToken(nft) {
    const web3Modal = new Web3Modal()
    const connect = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connect)
    // signer: 当前用户
    const signer = provider.getSigner()
    const MarketContract = new ethers.Contract(nftMarketAddress, NFTMarket.abi, signer)

    setLoadingState('not-loaded')
    const transaction = await MarketContract.auctionAdminEnd(nft.tokenId, nftAddress)
    await transaction.wait()
    setLoadingState('loaded')
    loadNFTs()
  }

  if (loadingState === 'loaded' && !nfts.length) return (
    <div>
      <MarketOffcanva />
      <main className="flex-shrink-0">
        <div className="container">
          <h1 className="mt-5">没有NFT在拍卖场中</h1>
          <p className="lead">请等待拍卖场开启</p>
          <p>点击回到 <a href="/">主页</a></p>
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
      <MarketOffcanva />
      <div className='container mt-2'>
        <div className='row g-2 row-cols-2 row-cols-md-4 row-cols-lg-4 row-cols-xl-4'>
          {
            // 循环现有nft并在页面展示
            nfts.map((nft, i) => (

              <div className='col-md marketItems p-0'>
                <div key={i} className="card h-100 w-100">
                  <Link href={`/salesroom?tokenId=${nft.tokenId}`}>
                    <img src={nft.image} className="card-img-top img-fluid center-block w-100 h-100" alt="..." />
                  </Link>
                  <div className="card-body">
                    <div>
                      <h5 className="card-title mb-2">{nft.name}</h5>
                      <p className="card-text mb-1">{nft.description}</p>
                      <p className="card-text mb-3 iconfont">起拍价: &#xe67b; {nft.price} ETH</p>
                    </div>
                    {admin &&
                      <a
                        href="#"
                        className="btn btn-danger w-100 mt-1"
                        onClick={() => removeToken(nft)}
                      >下架</a>
                    }
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