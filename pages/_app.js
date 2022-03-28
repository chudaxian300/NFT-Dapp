import '../styles/app.css'
import '../styles/iconfont/iconfont.css'
import 'bootstrap/dist/css/bootstrap.css'
import CompnyInfo from './compnyInfo.js'
import Link from 'next/link'
import Head from 'next/head'
import Script from 'next/script'

function MarketPlace({ Component, pageProps }) {

  return (
    <div>
      <Head>
        <title>exchange</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAoCAMAAABDwLOoAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABIUExURQFK/QJJ/QFK/QNJ/wJJ/AJJ/QJJ/kdwTAFK/QBH/wFK/QNJ/QJJ/QFJ/QJJ/wBK/wFK/QJJ/wFJ/gJJ/gBM/wRJ/AJK/gJK/QmUllwAAAAXdFJOU3+htyv75osAvwvVSPLKeB2wa5RhBDhTvPme5QAAAZxJREFUOMudlNu2gyAMRAGFIoK3qvn/Pz0TLkVr7eo69KHabkLCTCIeb6tX/ftP4vzaKCJSzRemMy3Fj+lumHXW5MVMBt96Xj8xvSOS4+NJJsZz/YUZJ6Kw4YGZlNc0nhjeqJ/xMTExbEkrMk9d05wzg/R83gdmCzVuJzy1S8bHpY3ni1FSzW9HQNeSL1U1lusQtta54RdnhHHnXRbMliNL5C0FL6lxer7sLjLxZR08eSXKUr5UUZkNiQQj6jIBUfcTI4j0EQGE8+SJGVhJe0AsqrswakJCMhMSz8N+ZYTBXr2AWJAc1O0/MPgTGoUlpNu9YdLNFHXvGCECTVmue2aiYql7Rv3EDP9nmpBu5sjA4QeG3UxF08ywIX3V1ETNWaCJhaI5G3I5eAOu43PYfvAYM2xRNPR6YFxREpfsAglY3e21M230vC56Q3tefljriIDnU++4bDA+kDVPVi69U3rQJofmjs4j4tWDuZdRlXp19LWX80w4DB5+fZsJZbbY8RX2w2yJ44BnVBfTu5lRZcTM4cusQyk/zMyb2fsHoz8xnKe5hdAAAAAASUVORK5CYII="></link>
      </Head>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow">
        <div className="container-fluid">
          <Link href='/'>
            <h1>
              <a className="navbar-brand" href="#">
                <img src="icon.png" alt="" width="40" height="40" className="d-inline-block align-text-center" />
                <span className="d-inline-block ms-2">Bootstrap</span>
              </a>
            </h1>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <form className="d-flex nav-search mx-auto" style={{width: '50%'}}>
              <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-primary" type="submit">Search</button>
            </form>
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
                  <a className="nav-link active" aria-current="page" href="#">交易所</a>
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