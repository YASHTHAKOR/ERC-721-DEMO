const NFT = artifacts.require('./NFT');
const { tokens, ether, ETHER_ADDRESS, expectRevert, expectEvent } = require('./helpers');


require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('NFT', ([acc1, acc2]) => {
    let nft

    beforeEach(async () => {
        nft = await NFT.new()
    })

    describe('deploy and test...', () => {
        it('...name', async () => {
            expect(await nft.name()).to.be.eq('YASH DEMO')
        })

        it('...symbol', async () => {
            expect(await nft.symbol()).to.be.eq('YDMO')
        })

        it('...owner address', async () => {
            expect(await nft._owner()).to.be.eq(acc1)
        })
    })

    beforeEach(async () => {
        await nft.mint('token_uri_1', ether(0.01))
        await nft.mint('token_uri_2', ether(0.02))
        await nft.mint('token_uri_3', ether(0.03))
    })

    it('...total supply', async () => {
        expect(Number(await nft.totalSupply())).to.be.eq(3)
    })

    it("...URI's", async () => {
        expect(await nft.tokenURI('1')).to.be.eq('token_uri_1')
        expect(await nft.tokenURI('2')).to.be.eq('token_uri_2')
        expect(await nft.tokenURI('3')).to.be.eq('token_uri_3')
    })

    it("...prices", async () => {
        expect(Number(await nft.price('1'))).to.be.eq(Number(ether(0.01)))
        expect(Number(await nft.price('2'))).to.be.eq(Number(ether(0.02)))
        expect(Number(await nft.price('3'))).to.be.eq(Number(ether(0.03)))
    })

})