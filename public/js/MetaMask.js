const initialize = () => {
    //Basic Actions Section
    const onboardButton = document.getElementById('connectButton');
    //检查功能，看看是否MetaMask扩展安装
    const isMetaMaskInstalled = () => {
        //必须检查窗口对象上的以太坊绑定，看看它是否安装了
        const { ethereum } = window;
        return Boolean(ethereum && ethereum.isMetaMask);
    };

    //这将启动安装程序
    const onClickInstall = () => {
        onboardButton.innerText = '请安装';
        onboardButton.disabled = true;
    };

    //这将启动连接程序
    const onClickConnect = async () => {
        try {
            // 唤起MetaMask
            await ethereum.request({ method: 'eth_requestAccounts' });
            onboardButton.innerText = '已连接 MetaMask!';
        } catch (error) {
            console.log(error);
        }
    };

    //检查MetaMask是否安装与连接
    const MetaMaskClientCheck = async () => {
        if (!isMetaMaskInstalled()) {
            onboardButton.innerText = '请安装 MetaMask!';
            onboardButton.onclick = onClickInstall();
            onboardButton.disabled = false;
        } else {
            onboardButton.innerText = '请连接 MetaMask!';
            onboardButton.onclick = onClickConnect();
            onboardButton.disabled = false;

            const accounts = await ethereum.request({ method: 'eth_accounts' });
            console.log('account:', accounts)
        }
    };

    MetaMaskClientCheck();
};

initialize()