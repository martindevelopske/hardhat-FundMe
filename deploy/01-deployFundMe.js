//import
//main fn
//call main

const { network, getNamedAccounts, deployments } = require("hardhat")
//verify
const { verify } = require("../utils/verify")
// function deployFunc(hre) {
//     console.log("hi motherfucker")
// }

// module.exports.default = deployFunc
//hre-hardhat runtime environment
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    log(chainId)
    //if chainId is x use address Y
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419"
    }
    //mock contracts
    //if the contract doesnt exist, we deploy a minimal version of it
    //when going for local host or hardhat net we want to use a mock.
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }

    log("-------------------------------------------------")
}
module.exports.tags = ["all", "fundme"]
