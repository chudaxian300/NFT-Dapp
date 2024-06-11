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
        const provider = new ethers.providers.JsonRpcProvider()
        const NFTContract = new ethers.Contract(nftAddress, NFT.abi, provider)
        const MarketContract = new ethers.Contract(nftMarketAddress, NFTMarket.abi, provider)

        // ====刷新query参数丢失问题未解决, 暂时用以下方法代替====
        const [_, curTokenId] = (router.asPath).split("=")
        // ====================================================

        const tokenDetail = await MarketContract.getTokenDetail(curTokenId)
        const auctionDetail = await MarketContract.getAuctionDetail(curTokenId)

        const price = ethers.utils.formatUnits(auctionDetail.highestBid, 'ether')
        const tokenUri = await NFTContract.tokenURI(tokenDetail.tokenId)
        const meta = await axios.get(tokenUri)

        let item = {
            price: price,
            tokenId: tokenDetail.tokenId.toNumber(),
            seller: tokenDetail.seller,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
            endAt: auctionDetail.endAt.toNumber(),
            ended: auctionDetail.ended,
            highestBid: price,
            highestBidder: auctionDetail.highestBidder
        }
        const signer = provider.getSigner()
        const account = await signer.getAddress()

        setNFT(item)
        setLoadingState('loaded')
    }

    async function bid(nft) {
<<<<<<< HEAD
        const forms = document.querySelectorAll('.needs-validation')
        // Loop over them and prevent submission
        Array.from(forms).forEach(form => {
            if (!form.checkValidity()) {
               form.classList.add('was-validated') 
            }
        })
        console.log(bidInput.bid)
        if (bidInput.bid==0 || isNaN(bidInput.bid)) {
            alert("出价金额必须为数字")
            return
        }
=======
        console.log(nfts)
>>>>>>> 739291245fcd1ec4276e6fa39217ad82da77a7f2
        if (nft.endAt < Date.now() / 1000) {
            alert('拍卖已结束不能出价')
            return
        }
        const web3Modal = new Web3Modal()
        const connect = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connect)
        // signer: 当前用户
        const signer = provider.getSigner()
        const account = await signer.getAddress()
        if (account === nft.seller) {
            alert('自己不能出价')
            return
        }
        const MarketContract = new ethers.Contract(nftMarketAddress, NFTMarket.abi, signer)
        let newBid = ethers.utils.parseUnits(bidInput.bid, 'ether')
<<<<<<< HEAD

        try {
            const transaction = await MarketContract.auctionBid(nft.tokenId, {
                value: newBid
            })
            await transaction.wait()
            router.reload()
        } catch (error) {
            alert("出价不能低于当前最高出价")
            console.log(error)
        }


=======
        console.log(newBid)
        const transaction = await MarketContract.auctionBid(nft.tokenId, {
            value: newBid
        })
        await transaction.wait()
        router.reload()
>>>>>>> 739291245fcd1ec4276e6fa39217ad82da77a7f2
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
                        <img src={'/img/auctionSysbom.jpeg'} className="img tokenImg" />
                        <span className='fs-2 ms-4 align-middle fw-bolder'>拍卖</span>
                    </div>
                    <div className='col col-12 text-center mb-5 align-self-center'>
                        <img src={nfts.image} className="img-fluid img-thumbnail anime-img-preview  w-25 h-25" alt="..." />
                    </div>
                    <div className='col col-12 text-center'>
                        <div className='row'>
                            <div className='col col-6 col-md-3 border-end border-bottom border-info'><p className='fw-bolder'>NFT编号</p># {nfts.tokenId}</div>
                            <div className='col col-6 col-md-3 border-end border-bottom border-info pb-3'><p className='fw-bolder'>结束时间</p><span id='endTime'>{nfts.endAt}</span></div>
                            <div className='col col-6 col-md-3 border-end border-bottom border-info'><p className='fw-bolder'>当前价格</p>{nfts.highestBid} ETH</div>
                            <div className='col col-6 col-md-3 overflow-hidden highestBidder border-bottom border-info pb-3'><p className='fw-bolder'>当前最高出价人</p>{nfts.highestBidder}</div>
                        </div>
                    </div>
                    <div className='col col-12 mt-3 text-center'>
                        <button type="button" className="btn btn-primary w-25" data-bs-toggle="modal" data-bs-target="#bidModal">出价</button>
                    </div>
                    <div className='col col-12 mt-3'>
                        <p className="input-group-text fw-bolder m-0">商品描述</p>
                        <div className='border p-2'>{nfts.description}</div>
                    </div>
                    {/* 出价弹窗 */}
                    <div className="modal fade" id="bidModal" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalToggleLabel2">拍卖出价</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form className="needs-validation" noValidate>
                                        <div className="mb-3">
                                            <label htmlFor="recipient-name" className="col-form-label">输入你的出价(单位:ETH):</label>
                                            <div className="input-group mb-3">
                                                <span className="input-group-text iconfont">&#xe67b;</span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="resell-price"
                                                    onChange={e => setBidInput({ ...bidInput, bid: (e.target.value).toString() })}
                                                    aria-label="Amount (to the nearest dollar)"
                                                    required
                                                />
                                                <span className="input-group-text">ETH</span>
                                                <div className="invalid-feedback">
                                                    请输入出价
                                                </div>
                                            </div>
                                            <div id='basic-addon2' className="form-text mb-3">价格不可小于当前最高出价: {nfts.highestBid} ETH</div>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <a
                                        className="btn btn-primary"
                                        aria-label="Close"
                                        onClick={() => bid(nfts)}
                                    >出价</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
<<<<<<< HEAD
            <Script src="/js/timeUtils.js" strategy="afterInteractive" />
=======
            <Script src="/js/timeUtils.js" strategy="afterInteractive"/>
>>>>>>> 739291245fcd1ec4276e6fa39217ad82da77a7f2
        </div>
    )
}