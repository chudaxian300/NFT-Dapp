import { ethers } from 'ethers'
import { useState } from 'react'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import Web3Modal from 'web3modal'
import { nftMarketAddress, nftAddress } from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import NFTMarket from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import { useRouter } from 'next/router'
import Script from 'next/script'

// 使用ipfs托管nft里存储的数据
const client = ipfsHttpClient('http://127.0.0.1:5001/api/v0')
//const client = ipfsHttpClient('http://127.0.0.1/tcp/8080')

export default function MintItem() {
    const [file, setFile] = useState(null)
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, setFormInput] = useState({
        name: '',
        description: ''
    })
    const router = useRouter()
    // nft图片处理
    async function getImg(e) {
        const newFile = e.target.files[0]
        setFile(newFile)
    }

    async function uploadImg(e) {
        // console.log(document.getElementById('inputGroupFile04'))
        // const file = e.target.files[0]

        try {
            //往ipfs里添加元素
            console.log(client)
            const added = await client.add(
                file,
                {
                    progress: (prog) => {
                        console.log(`upload: ${prog}`)
                    }
                }
            )
            console.log(added)
            const url = `http://localhost:8080/ipfs/${added.path}`
            setFileUrl(url)
        } catch (error) {
            console.log('Upload file error:', error)
        }
    }

    // nft其他信息处理
    async function createItemInfo(e) {
        e.preventDefault();
        const { name, description, price } = formInput
        const forms = document.querySelectorAll('.needs-validation')
        // Loop over them and prevent submission
        Array.from(forms).forEach(form => {
            if (!form.checkValidity()) {
               form.classList.add('was-validated') 
            }
        })
        if (!name || !description || !fileUrl) return
        const data = JSON.stringify({
            name,
            description,
            image: fileUrl
        })
        try {
            // ipfs二次存储,为整合图片后的其他信息
            const added = await client.add(data)
            const url = `http://localhost:8080/ipfs/${added.path}`
            createItem(url)
        } catch (error) {
            console.log('Upload file error:', error)
        }
    }

    // 铸造物品
    async function createItem(url) {
        const web3Modal = new Web3Modal()
        const connect = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connect)
        const signer = provider.getSigner()

        // 铸币
        let contract = new ethers.Contract(nftAddress, NFT.abi, signer)
        let transaction = await contract.mintToken(url)
        let tx = await transaction.wait()
        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber()

        contract = new ethers.Contract(nftMarketAddress, NFTMarket.abi, signer)

        transaction = await contract.addMarketItem(tokenId, nftAddress)
        await transaction.wait()

        router.push('/my-nfts')
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-6 my-5">
                    <form className="needs-validation" noValidate>

                        <div className="mb-3">
                            <label htmlFor="exampleInputName1" className="form-label">NFT名称</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="exampleInputName1"
                                    //aria-describedby="nameHelp"
                                    onChange={e => setFormInput({ ...formInput, name: e.target.value })}
                                    required
                                />
                                <div className="invalid-feedback">
                                    请输入名称
                                </div>
                            <div id="nameHelp" className="form-text">请慎重填写名称</div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="exampleInputDescription1" className="form-label">NFT描述</label>
                            <textarea
                                type="text"
                                className="form-control"
                                id="exampleInputDescription1"
                                aria-describedby="nameHelp"
                                onChange={e => setFormInput({ ...formInput, description: e.target.value })}
                                required
                            />
                            <div className="invalid-feedback">
                                    请输入描述
                            </div>
                        </div>

                        <label htmlFor="exampleInputPrice1" className="form-label">NFT图片</label>
                        <div className="input-group mb-3">
                            <input
                                type="file"
                                name='Asset'
                                className="form-control"
                                id="inputGroupFile04"
                                aria-describedby="inputGroupFileAddon04"
                                aria-label="Upload"
                                onChange={getImg}
                                required
                            />
                            <div className="invalid-feedback">
                                    请上传图片
                            </div>
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                id="inputGroupFileAddon04"
                                onClick={uploadImg}
                            >上传</button>
                        </div>
                        {
                            fileUrl && (
                                <img className='rounded img-fluid mb-3' src={fileUrl} />
                            )}
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-100 mt-5"
                            onClick={createItemInfo}
                        >铸造NFT</button>
                    </form>
                </div>
            </div>
        </div>
    )
}