import Link from 'next/link'

export default function Home() {
    return (
        <div>
            <div className='container-fluid'>
                <div className='row row-cols-1 '>
                    <div className='col p-0'>
                        <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <video className='d-block index-video' style={{ height: '900px' }} autoPlay loop muted>
                                        <source src={`/video/a.mp4`} type="video/mp4" />
                                    </video>
                                    <div className='index-title'>
                                        <h1>NFT</h1>
                                        <h2>让价值自由流通</h2>
                                        <div>
                                            <Link href='/mint-item'>
                                                <button>
                                                    <span style={{ color: '#ffffff' }}>发布数字藏品</span>
                                                </button>
                                            </Link>
                                            <Link href='/market'>
                                                <button>
                                                    <span style={{ color: '#ffffff' }}>浏览商品</span>
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='d-flex justify-content-center mt-5'>
                <h2 className='index-title-2'>优势</h2>
            </div>
            <div className='container mt-3'>
                <div className='row row-cols-1 row-cols-md-4'>
                    <div className='col'>
                        <div className="card border-0">
                            <div className="card-body">
                                <img className='mb-3' src="/img/advantage/advantage-4.png"></img>
                                <h5 className="card-title mb-3">藏品众多</h5>
                                <p className="card-text">拥有独家数字藏品，众多前卫创作者，藏品分类涵盖范围广。</p>
                            </div>
                        </div>
                    </div>
                    <div className='col'>
                        <div className="card border-0">
                            <div className="card-body">
                                <img className='mb-3' src="/img/advantage/advantage-1.png"></img>
                                <h5 className="card-title mb-3">安全可信</h5>
                                <p className="card-text">依托区块链溯源，藏品铸造链上留痕，来源可溯，记录可查，版权可信。</p>
                            </div>
                        </div>
                    </div>
                    <div className='col'>
                        <div className="card border-0">
                            <div className="card-body">
                                <img className='mb-3' src="/img/advantage/advantage-3.png"></img>
                                <h5 className="card-title mb-3">费用更低</h5>
                                <p className="card-text">发行手续费低于行业平均水平；数字藏品交易佣金比例低。</p>
                            </div>
                        </div>
                    </div>
                    <div className='col'>
                        <div className="card border-0">
                            <div className="card-body">
                                <img className='mb-3' src="/img//advantage/advantage-2.png"></img>
                                <h5 className="card-title mb-3">铸造更快</h5>
                                <p className="card-text">流程操作更便捷，藏品生成更迅速。</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='d-flex justify-content-center mt-5'>
                <h2 className='index-title-2'>新手教程</h2>
            </div>
            <div className='container mb-5 mt-4'>
                <div className='row row-cols-1 row-cols-md-3'>
                    <div className='col'>
                        <div className="card cource">
                            <img className="card-img-top" src="/img/cource/cource-3.png" />
                            <div className="card-body">
                                <h5 className="card-title fs-4 index-title-2">创建账号教程</h5>
                                <p className="card-text">打开MetaMask,然后点击头像再点击导入账户，选择你的导入方式，导入成功后链接本网站即可</p>
                            </div>
                        </div>
                    </div>
                    <div className='col'>
                        <div className="card cource">
                            <img className="card-img-top" src="/img/cource/cource-1.png" />
                            <div className="card-body">
                                <h5 className="card-title fs-4 index-title-2">购买数字藏品教程</h5>
                                <p className="card-text">了解藏品的拍卖和购买流程，帮您完成购买心仪的数字藏品的愿望。</p>
                            </div>
                        </div>
                    </div>
                    <div className='col'>
                        <div className="card cource">
                            <img className="card-img-top" src="/img/cource/cource-2.png" />
                            <div className="card-body">
                                <h5 className="card-title fs-4 index-title-2">发布数字藏品教程</h5>
                                <p className="card-text">上传您的藏品，添加标题和描述，并自定义您的 数字藏品，包括属性、统计数据和可解锁的内容</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}