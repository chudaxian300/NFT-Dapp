function CompnyInfo() {
    return (
        <div>
            <div className="container">
                <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
                    <div className="col-md-4 d-flex align-items-center">
                        <img src="icon.png" alt="" width="40" height="40" className="d-inline-block align-text-center" />
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