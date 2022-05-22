# NFT交易所项目源码

## 项目介绍
本项目主要功能为基于ERC721非同质化代币交易,
用户可自行铸造NFT, 或前往市场购买NFT, 满足用户NFT收藏需求
该项目为用户出售NFT提供了两种方案, 分别为直接出售和进行拍卖
购买者也可以前往市场或拍卖场参与NFT市场行为

## 项目亮点
* 前端采用next.js框架, 利用ethers实现前端与区块链交互
* 使用IPFS存储NFT信息, 与区块链结合加强NFT安全性
* 使用bootstrap, 纯手工编写页面
* 合约编写与迁移工作使用hardhat框架实现
* 基于ERC721的交易与同时多个拍卖支持


## 源码组织
由于本项目开发过程中始终实践***开发->重构->再开发***的敏捷模式，因此代码随项目进度变动较大。为了方便项目开发，本项目的源码将采用git branch的形式进行组织，同步源码进度。分支列表如下：

* **main** 主分支，本branch不要求严格与视频对应。bug fix也将在master分支中进行。
  * bug fix是否在其他分支体现将视情况而定。
* **Ipfs-and-other** 实现IPFS功能和其他细节优化。
* **front-optimize** 前端页面使用bootstrap完全重构与设计。
* **resell **添加转卖功能
* **auction-and-mint-separation** 较大更新, 添加拍卖功能, 并把铸造和出售两个功能分离, 以此提高用户体验

为防止过多的branch，根据代码覆盖范围，重构力度来考虑branch。并非每个功能都对应一个branch。

## 如何使用
1. `git clone https://github.com/chudaxian300/NFT-Dapp.git`
1. `cd NFT-Dapp-main` 进入项目目录。
1. 此时我们会在main branch里。
1. 一般情况下，并不需要拉取其他branch的内容。
1. 如果需要下载特定功能对应的代码到本地运行。
`git checkout <branch> `即可。

## 如何编译以及运行
1. `cd NFT-Dapp-main `进入项目目录
1. 开启第一个终端输入:`npm install`, 再输入: `npm run dev`
1. 开启第二个终端输入: `npx hardhat node`
1. 开启第二个终端输入: `npx hardhat run scripts/deploy.js --network localhost`

## 产品体验


http://localhost:3000/
