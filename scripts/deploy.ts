import { ethers } from 'hardhat'
import { utils } from 'ethers'

async function main() {
  const Donate = await ethers.getContractFactory('Donate')
  const defaultDonationAmount = utils.parseEther('0.01')

  const ADMIN_ADDRESS = process.env.ADMIN_ADDRESS || '0x9e99ef303c646C5C9b8D3f1f84Ed9B1053c48505'
  const donate = await Donate.deploy(ADMIN_ADDRESS, defaultDonationAmount)

  await donate.deployed()

  console.log(`Donate deployed to ${donate.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
