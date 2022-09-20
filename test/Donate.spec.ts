import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { constants, utils } from 'ethers'

describe('Donate', function () {
  async function deployDonateFixture() {
    const [owner, receipt, alice, bob] = await ethers.getSigners()

    const donationAmount = utils.parseEther('0.01')

    const Donate = await ethers.getContractFactory('Donate')
    const donate = await Donate.deploy(receipt.address, donationAmount)

    return { donate, owner, receipt, donationAmount, alice, bob }
  }

  describe('Deployment', function () {
    it('Should set the right receipt', async function () {
      const { donate, receipt } = await loadFixture(deployDonateFixture)

      expect(await donate.getReceiptAddresses()).to.deep.equal([receipt.address])
      expect(await donate.isRegisteredReceipt(receipt.address)).to.equal(true)
    })

    it('Should set the right donation amount', async function () {
      const { donate, donationAmount } = await loadFixture(deployDonateFixture)

      expect(await donate.getDonationAmounts()).to.deep.equal([donationAmount])
      expect(await donate.isRegisteredAmount(donationAmount)).to.equal(true)
    })
  })

  describe('Donate', function () {
    it('Revert: receipt option must be valid', async function () {
      const { donate, alice } = await loadFixture(deployDonateFixture)
      const amount = utils.parseEther('0.1')

      await expect(donate.connect(alice).donate(1, 0, { value: amount })).to.be.revertedWith(
        'Donate: invalid receipt option'
      )
    })

    it('Revert: donation option must be valid', async function () {
      const { donate, alice } = await loadFixture(deployDonateFixture)
      const amount = utils.parseEther('0.1')

      await expect(donate.connect(alice).donate(0, 1, { value: amount })).to.be.revertedWith('Donate: invalid donate option')
    })

    it('Revert: donation amount must be valid', async function () {
      const { donate, alice } = await loadFixture(deployDonateFixture)
      const amount = utils.parseEther('0.1')

      await expect(donate.connect(alice).donate(0, 0, { value: amount })).to.be.revertedWith(
        'Donate: invalid donation amount'
      )
    })

    it('Event: should emit {Donation} event', async function () {
      const { donate, receipt, alice } = await loadFixture(deployDonateFixture)
      const amount = utils.parseEther('0.01')

      await expect(donate.connect(alice).donate(0, 0, { value: amount }))
        .to.emit(donate, 'Donation')
        .withArgs(alice.address, receipt.address, amount)
    })

    it('Should be updated with correct balance', async function () {
      const { donate, receipt, alice } = await loadFixture(deployDonateFixture)
      const amount = utils.parseEther('0.01')

      const oldReceiptBalance = await receipt.getBalance()
      const oldAliceBalance = await alice.getBalance()
      const tx = await donate.connect(alice).donate(0, 0, { value: amount })
      const newReceiptBalance = await receipt.getBalance()
      const newAliceBalance = await alice.getBalance()

      const re = await tx.wait()
      const gasUsed = re.gasUsed.mul(re.effectiveGasPrice)

      expect(newReceiptBalance).to.equal(oldReceiptBalance.add(amount))
      expect(newAliceBalance).to.equal(oldAliceBalance.sub(amount).sub(gasUsed))
    })
  })

  describe('Add receipt address', function () {
    it('Revert: only owner can update receipt address', async function () {
      const { donate, alice, bob } = await loadFixture(deployDonateFixture)
      await expect(donate.connect(alice).addReceipt(bob.address)).to.be.revertedWith('Ownable: caller is not the owner')
    })

    it('Revert: receipt address must not be zero address', async function () {
      const { donate, owner } = await loadFixture(deployDonateFixture)
      await expect(donate.connect(owner).addReceipt(constants.AddressZero)).to.be.revertedWith(
        'Donate: invalid receipt address'
      )
    })

    it('Revert: receipt address must not be registered', async function () {
      const { donate, owner, receipt } = await loadFixture(deployDonateFixture)
      await expect(donate.connect(owner).addReceipt(receipt.address)).to.be.revertedWith(
        'Donate: address is already registered'
      )
    })

    it('Event: should emit a {ReceiptAdded} event', async function () {
      const { donate, owner, alice } = await loadFixture(deployDonateFixture)
      await expect(donate.connect(owner).addReceipt(alice.address)).to.emit(donate, 'ReceiptAdded').withArgs(alice.address)
    })

    it('Should set the with correct receipt address', async function () {
      const { donate, owner, receipt, alice } = await loadFixture(deployDonateFixture)
      await donate.connect(owner).addReceipt(alice.address)
      expect(await donate.getReceiptAddresses()).to.deep.equal([receipt.address, alice.address])
    })
  })

  describe('Add donation amount', function () {
    it('Revert: only owner can update donation amount', async function () {
      const { donate, alice } = await loadFixture(deployDonateFixture)
      const newAmount = utils.parseEther('1')
      await expect(donate.connect(alice).addDonationAmount(newAmount)).to.be.revertedWith('Ownable: caller is not the owner')
    })

    it('Revert: donation amount must not be zero', async function () {
      const { donate, owner } = await loadFixture(deployDonateFixture)
      await expect(donate.connect(owner).addDonationAmount(0)).to.be.revertedWith('Donate: amount must not be zero')
    })

    it('Revert: donation amount must not be registered', async function () {
      const { donate, owner, donationAmount } = await loadFixture(deployDonateFixture)
      await expect(donate.connect(owner).addDonationAmount(donationAmount)).to.be.revertedWith(
        'Donate: amount is already registered'
      )
    })

    it('Event: should emit a {DonationAmountAdded} event', async function () {
      const { donate, owner } = await loadFixture(deployDonateFixture)
      const newAmount = utils.parseEther('1')
      await expect(donate.connect(owner).addDonationAmount(newAmount))
        .to.emit(donate, 'DonationAmountAdded')
        .withArgs(newAmount)
    })

    it('Should set the correct donation amount', async function () {
      const { donate, owner, donationAmount } = await loadFixture(deployDonateFixture)
      const newAmount = utils.parseEther('1')
      await donate.connect(owner).addDonationAmount(newAmount)
      expect(await donate.getDonationAmounts()).to.deep.equal([donationAmount, newAmount])
    })
  })
})
