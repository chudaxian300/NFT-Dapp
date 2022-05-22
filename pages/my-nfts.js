import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Web3Modal from 'web3modal'
import { nftMarketAddress, nftAddress } from '../config'
import { useRouter } from 'next/router'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import NFTMarket from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import { create } from 'ipfs-http-client'

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
            <Link href='/my-auction-nfts'>
              <button type="button" className="dropdown-item btn-lg" data-bs-dismiss="offcanvas">我的拍卖</button>
            </Link>
          </div>
        </div>
        <img src={'/img/infrastructure_transparent.png'} className="card-img-top img center-block" />
      </div>
    </div>
  )
}

export default function MyNft() {
  const [nfts, setNFts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [curNft, setCurNft] = useState({})
  const [resellFormInput, setResellFormInput] = useState({
    price: '',
  })
  const [auctionFormInput, setAuctionFormInput] = useState({
    price: '',
    startTime: '',
  })

  const router = useRouter()

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
    const data = await MarketContract.getMyToken()

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
        description: meta.data.description,
        creater: i.creater,
      }
      return item
    }))
    setNFts(items)
    setLoadingState('loaded')
  }

  async function sellMyNFT(nft, newPrice) {
    const web3Modal = new Web3Modal()
    const connect = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connect)
    // signer: 当前用户
    const signer = provider.getSigner()
    const NFTContract = new ethers.Contract(nftAddress, NFT.abi, signer)
    const MarketContract = new ethers.Contract(nftMarketAddress, NFTMarket.abi, signer)

    let listingPrice = await MarketContract.listingPrice()
    listingPrice = listingPrice.toString()
    let price = ethers.utils.parseUnits(newPrice, 'ether')

    await NFTContract.setApprovalForAll(nftMarketAddress, true)

    setLoadingState('not-loaded')
    const transaction = await MarketContract.makeMarketItem(nft.tokenId, price, nftAddress, {
      value: listingPrice
    })
    await transaction.wait()
    setLoadingState('loaded')
    router.reload()
  }

  async function auctionMyNft(nft, auctionPrice, time) {
    const web3Modal = new Web3Modal()
    const connect = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connect)
    // signer: 当前用户
    const signer = provider.getSigner()
    const NFTContract = new ethers.Contract(nftAddress, NFT.abi, signer)
    const MarketContract = new ethers.Contract(nftMarketAddress, NFTMarket.abi, signer)

    let listingPrice = await MarketContract.listingPrice()
    listingPrice = listingPrice.toString()
    let price = ethers.utils.parseUnits(auctionPrice, 'ether')

    await NFTContract.setApprovalForAll(nftMarketAddress, true)
    console.log(nft)
    setLoadingState('not-loaded')
    const transaction = await MarketContract.auctionStart(nft.tokenId, price, nftAddress, time, {
      value: listingPrice
    })
    await transaction.wait()
    setLoadingState('loaded')
    router.reload()
  }

  if (loadingState === 'loaded' && !nfts.length) return (
    <div>
      <UserOffcanva />
      <main className="flex-shrink-0">
        <div className="container">
          <h1 className="mt-5">你目前没有任何NFT</h1>
          <p className="lead">赶紧去购买你喜欢的NFT吧</p>
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
                  <img src={nft.image} className="card-img-top" />
                  <div className="card-body">
                    <h5 className="card-title mb-2">{nft.name}</h5>
                    <p className="app_p">铸造者:&nbsp;&nbsp;{nft.creater}</p>
                    <p className="app_p">售卖者:&nbsp;&nbsp;{nft.seller}</p>
                    <p className="card-text mb-1">{nft.description}</p>
                    <a
                      className="btn btn-primary w-100"
                      // onClick={() => sellMyNFT(nft)}
                      data-bs-toggle="modal"
                      href="#exampleModalToggle"
                      role="button"
                      onClick={() => setCurNft(nft)}
                    >出售</a>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
      {/* 外层弹框 */}
      <div className="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalToggleLabel">选择你的卖出方式</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              直接卖出: 填入价格, 直接售卖<br />
              进行拍卖: 输入起拍价和拍卖时间, 开始拍卖
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" data-bs-target="#exampleModalToggle2" data-bs-toggle="modal">直接卖出</button>
              <button className="btn btn-primary" data-bs-target="#exampleModalToggle3" data-bs-toggle="modal">进行拍卖</button>
            </div>
          </div>
        </div>
      </div>
      {/* 内层弹框1 */}
      <div className="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalToggleLabel2">直接卖出</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="recipient-name" className="col-form-label">输入卖出价格(单位:ETH):</label>
                  <div className="input-group mb-3">
                    <span className="input-group-text iconfont">&#xe67b;</span>
                    <input
                      type="text"
                      className="form-control"
                      id="resell-price"
                      onChange={e => setResellFormInput({ ...resellFormInput, price: (e.target.value).toString() })}
                      aria-label="Amount (to the nearest dollar)"
                    />
                    <span className="input-group-text">ETH</span>
                  </div>
                  <div id='basic-addon2' className="form-text mb-3">价格不可小于上架手续费: 0.045 ETH</div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" data-bs-target="#exampleModalToggle" data-bs-toggle="modal">返回</button>
              <a
                className="btn btn-primary"
                aria-label="Close"
                onClick={() => sellMyNFT(curNft, resellFormInput.price)}
              >卖出</a>
            </div>
          </div>
        </div>
      </div>
      {/* 内层弹框2 */}
      <div className="modal fade" id="exampleModalToggle3" aria-hidden="true" aria-labelledby="exampleModalToggleLabel3" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalToggleLabel2">进行拍卖</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="recipient-name" className="col-form-label">起拍价格:</label>
                  <div className="input-group mb-3">
                    <span className="input-group-text iconfont">&#xe67b;</span>
                    <input
                      type="text"
                      className="form-control"
                      id="auction-price"
                      onChange={e => setAuctionFormInput({ ...auctionFormInput, price: (e.target.value).toString() })}
                      placeholder='0.045'
                      aria-label="Amount (to the nearest dollar)"
                    />
                    <span className="input-group-text">ETH</span>
                  </div>
                  <div id='basic-addon2' className="form-text mb-3">如不填, 则起拍价默认为从0.045开始</div>
                </div>
                <div className="mb-3">
                  <label htmlFor="message-text" className="col-form-label">拍卖时间:</label>
                  <input
                    type="data_"
                    className="form-control"
                    id="auction-startTime"
                    onChange={e => setAuctionFormInput({ ...auctionFormInput, startTime: e.target.value })}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" data-bs-target="#exampleModalToggle" data-bs-toggle="modal">返回</button>
              <a className="btn btn-primary" aria-label="Close" onClick={() => { auctionMyNft(curNft, auctionFormInput.price, auctionFormInput.startTime) }}>开始拍卖</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
