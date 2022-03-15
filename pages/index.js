import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Link from 'next/link'

export default function Home() {
    return (
        <div>
            <div className='wrapper'>
                <div className='index-title'>
                    <h1>NFT</h1>
                    <h2>让价值自由流通</h2>
                    <div>
                        <button>
                            <Link href='/mint-item'>
                                <span style={{ color: '#ffffff' }}>发布数字藏品</span>
                            </Link>
                        </button>
                        <button>
                            <Link href='/market'>
                                <span style={{ color: '#ffffff' }}>浏览商品</span>
                            </Link>
                        </button>
                    </div>
                </div>
                {/* <Swiper
                    spaceBetween={50}
                    slidesPerView={1}
                    onSlideChange={() => console.log('slide change')}
                    onSwiper={(swiper) => console.log(swiper)}
                >
                    <SwiperSlide> */}
                <video autoplay={'autoplay'} loop={'loop'} muted={"muted"} className='swiper-video'>
                    <source src={`/video/a.mp4`} type="video/mp4"></source>
                </video>
                {/* </SwiperSlide>
                    <SwiperSlide> */}
                {/* <video autoplay={'autoplay'} loop={'loop'} muted={"muted"} className='swiper-video'>
                            <source src={`/video/b.mp4`} type="video/mp4"></source>
                        </video> */}
                {/* </SwiperSlide>
                </Swiper> */}

            </div>
            <div className='index-main'>
                <h3>优势</h3>
                <div className='advantage'>
                    <div className='advantage-info'>
                        <div>
                            <img data-v-f2fc9792="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAlCAMAAAAZd2syAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABIUExURUdwTCIoNB0gKwDQ6B0gKx0gKyAgKx4gLB0hLR0gK////+jp6pWWnBvV6lHf7/L8/rPx+AemuxVVZcr1+prs9oLo9OL6/A58jgo8f1oAAAAKdFJOUwAW//94k0eyPOaTU8lhAAAA+klEQVQ4y7WUWRKEIAxEtdHBjcX9/jcdJagFKjAf01UKhEcgKUiWxVVwaite17y6z5O9BHJDw6i4eYHVx6wBurbtAM/faaf1HF2zqQN3Mc9eo92HLW6y9voX7HQ+MEeDu+l51N7Fei80G/jKPK1eoioODD27qR8AJ+0ATUjVkCSNASdHFhNKCiOpRACb9LGfnt4xYX1c3UdMz9fxZ/2KLfLC5PKKSXVytvscwhHgHnIgUjYvhhPLHMrblpJx/48TC2NMa/oi2OaJPEYwMY4iAXPkYGkXKe1aJl7yxCfzp3caLg7RUkP2EuHCVRxUESyDppvbKhetrFUC9AWSYxO6ow/KmAAAAABJRU5ErkJggg=="></img>
                        </div>
                        <div>
                            <h5>藏品众多</h5>
                            <br></br>
                            <p>拥有独家数字藏品，众多前卫创作者，藏品分类涵盖范围广。</p>
                        </div>
                    </div>
                    <div className='advantage-info'>
                        <div>
                            <img data-v-f2fc9792="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAlCAMAAAAZd2syAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABIUExURUdwTCIoNB0gKwDQ6B0gKx0gKyAgKx4gLB0hLR0gK////+jp6pWWnBvV6lHf7/L8/rPx+AemuxVVZcr1+prs9oLo9OL6/A58jgo8f1oAAAAKdFJOUwAW//94k0eyPOaTU8lhAAAA+klEQVQ4y7WUWRKEIAxEtdHBjcX9/jcdJagFKjAf01UKhEcgKUiWxVVwaite17y6z5O9BHJDw6i4eYHVx6wBurbtAM/faaf1HF2zqQN3Mc9eo92HLW6y9voX7HQ+MEeDu+l51N7Fei80G/jKPK1eoioODD27qR8AJ+0ATUjVkCSNASdHFhNKCiOpRACb9LGfnt4xYX1c3UdMz9fxZ/2KLfLC5PKKSXVytvscwhHgHnIgUjYvhhPLHMrblpJx/48TC2NMa/oi2OaJPEYwMY4iAXPkYGkXKe1aJl7yxCfzp3caLg7RUkP2EuHCVRxUESyDppvbKhetrFUC9AWSYxO6ow/KmAAAAABJRU5ErkJggg=="></img>
                        </div>
                        <div>
                            <h5>藏品众多</h5>
                            <br></br>
                            <p>拥有独家数字藏品，众多前卫创作者，藏品分类涵盖范围广。</p>
                        </div>
                    </div>
                    <div className='advantage-info'>
                        <div>
                            <img data-v-f2fc9792="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAlCAMAAAAZd2syAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABIUExURUdwTCIoNB0gKwDQ6B0gKx0gKyAgKx4gLB0hLR0gK////+jp6pWWnBvV6lHf7/L8/rPx+AemuxVVZcr1+prs9oLo9OL6/A58jgo8f1oAAAAKdFJOUwAW//94k0eyPOaTU8lhAAAA+klEQVQ4y7WUWRKEIAxEtdHBjcX9/jcdJagFKjAf01UKhEcgKUiWxVVwaite17y6z5O9BHJDw6i4eYHVx6wBurbtAM/faaf1HF2zqQN3Mc9eo92HLW6y9voX7HQ+MEeDu+l51N7Fei80G/jKPK1eoioODD27qR8AJ+0ATUjVkCSNASdHFhNKCiOpRACb9LGfnt4xYX1c3UdMz9fxZ/2KLfLC5PKKSXVytvscwhHgHnIgUjYvhhPLHMrblpJx/48TC2NMa/oi2OaJPEYwMY4iAXPkYGkXKe1aJl7yxCfzp3caLg7RUkP2EuHCVRxUESyDppvbKhetrFUC9AWSYxO6ow/KmAAAAABJRU5ErkJggg=="></img>
                        </div>
                        <div>
                            <h5>藏品众多</h5>
                            <br></br>
                            <p>拥有独家数字藏品，众多前卫创作者，藏品分类涵盖范围广。</p>
                        </div>
                    </div>
                    <div className='advantage-info'>
                        <div>
                            <img data-v-f2fc9792="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAlCAMAAAAZd2syAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABIUExURUdwTCIoNB0gKwDQ6B0gKx0gKyAgKx4gLB0hLR0gK////+jp6pWWnBvV6lHf7/L8/rPx+AemuxVVZcr1+prs9oLo9OL6/A58jgo8f1oAAAAKdFJOUwAW//94k0eyPOaTU8lhAAAA+klEQVQ4y7WUWRKEIAxEtdHBjcX9/jcdJagFKjAf01UKhEcgKUiWxVVwaite17y6z5O9BHJDw6i4eYHVx6wBurbtAM/faaf1HF2zqQN3Mc9eo92HLW6y9voX7HQ+MEeDu+l51N7Fei80G/jKPK1eoioODD27qR8AJ+0ATUjVkCSNASdHFhNKCiOpRACb9LGfnt4xYX1c3UdMz9fxZ/2KLfLC5PKKSXVytvscwhHgHnIgUjYvhhPLHMrblpJx/48TC2NMa/oi2OaJPEYwMY4iAXPkYGkXKe1aJl7yxCfzp3caLg7RUkP2EuHCVRxUESyDppvbKhetrFUC9AWSYxO6ow/KmAAAAABJRU5ErkJggg=="></img>
                        </div>
                        <div>
                            <h5>藏品众多</h5>
                            <br></br>
                            <p>拥有独家数字藏品，众多前卫创作者，藏品分类涵盖范围广。</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}