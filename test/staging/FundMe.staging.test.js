const { assert } = require("chai")
const { getNamedAccounts, ethers } = require("ethers")
const { developmentChains } = require("../../helper-hardhat-config")
if (developmentChains.includes(network.name)) {
    describe.skip
} else {
    describe("FundMe", async function () {
        let FundMe
        let deployer
        const sendValue = ethers.utils.parseEther("1")
        beforeEach(async function () {
            deployer = (await getNamedAccounts()).deployer
            FundMe = await ethers.getContract("FundMe", deployer)
        })
        it("allows people to fund and withdraw", async function () {
            await FundMe.fund({ value: sendValue })
            await FundMe.withdraw()
            const endingBalance = await FundMe.provider.getBalance(
                fundMe.address
            )
            assert.equal(endingBalance.toString(), "0")
        })
    })
}
