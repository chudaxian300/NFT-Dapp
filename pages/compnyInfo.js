function CompnyInfo() {
    return (
        <div>
            <div className="container">
                <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
                    <div className="col-md-4 d-flex align-items-center">
                        <a href="/" className="mb-3 me-2 mb-md-0  text-muted text-decoration-none lh-1 iconfont">
                            <img src='icon.png' alt="..." />
                        </a>
                        <span className="text-muted">&copy; 2021 Company, Inc</span>
                    </div>

                    <ul className="nav col-md-4 justify-content-end d-flex shadow-none">
                        <li className="ms-3"><a className="text-muted iconfont text-decoration-none" href="#">&#xe65c;</a></li>
                        <li className="ms-3"><a className="text-muted iconfont text-decoration-none" href="https://space.bilibili.com/315684725/?spm_id_from=333.999.0.0">&#xe600;</a></li>
                        <li className="ms-3"><a className="text-muted iconfont text-decoration-none" href="#">&#xe63e;</a></li>
                    </ul>
                </footer>
            </div>
        </div> 
    )
}

export default CompnyInfo;