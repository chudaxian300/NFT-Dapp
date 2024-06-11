import '../styles/app.css'
import '../styles/iconfont/iconfont.css'
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/loadingStyle.css'
import CompnyInfo from './compnyInfo.js'
import Link from 'next/link'
import Head from 'next/head'
import Script from 'next/script'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { nftMarketAddress, nftAddress } from '../config'
import NFTMarket from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

function MarketPlace({ Component, pageProps }) {
  const [admin, setAdmin] = useState(false)
  useEffect(() => {
    isAdmin()
  }, [])

  async function isAdmin() {
    const provider = new ethers.providers.JsonRpcProvider()
    const MetaMaskProvider = new ethers.providers.Web3Provider(window.ethereum);
    const MarketContract = new ethers.Contract(nftMarketAddress, NFTMarket.abi, provider)

    const owner = await MarketContract.getOwner()
    const user = await MetaMaskProvider.getSigner().getAddress()
    setAdmin(owner == user)
  }

  return (
    <div>
      <Head>
        <title>交易市场</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="icon.png"></link>
      </Head>
      <nav className="navbar mainnav navbar-expand-lg navbar-light bg-white shadow ">
        <div className="container-fluid">
          <Link href='/'>
            <h1>
              <a className="navbar-brand" href="#">
                <img src="icon.png" alt="" width="40" height="40" className="d-inline-block align-text-center" />
                <span className="d-inline-block ms-2">NFT市场{ admin && ' (管理员)'}</span>
              </a>
            </h1>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse flex-row-reverse" id="navbarSupportedContent">
            {/* <form className="d-flex nav-search mx-auto" style={{width: '50%'}}>
              <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-primary" type="submit">Search</button>
            </form> */}
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item nav-active">
                <Link href='/'>
                  <a className="nav-link active">首页</a>
                </Link>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle active" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  个人
                </a>
                <ul className="dropdown-menu w-100" aria-labelledby="navbarDropdown">
                  <li><Link href='/my-nfts'><a className="dropdown-item">我的NFT</a></Link></li>
                  <li><Link href='/account-dashboard'><a className="dropdown-item">我的铸造记录</a></Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" id='connectButton'>Something else here</a></li>
                </ul>
              </li>
              <li className="nav-item">
                <Link href='/market'>
                  <a className="nav-link active" aria-current="page" href="#">市场</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href='/mint-item'>
                  <a className="nav-link active">铸造NFT</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Component {...pageProps} />
      <CompnyInfo />
      <Script
        src="/js/bootstrap.min.js"
        crossorigin="anonymous" />
      <Script src="/js/MetaMask.js" crossorigin="anonymous" />
    </div>
  )
}

export default MarketPlace 