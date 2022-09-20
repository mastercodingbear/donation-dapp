import { useContractReads } from 'wagmi'
import { ethers } from 'ethers'
import abi from '../abi/DonateABI'

interface ReturnType {
  receipts: string[]
  amounts: string[]
}

export const useDonate = (): ReturnType => {
  const donateAddress = process.env.CONTRACT_ADDRESS || '0x153030439EC9E7D7cfdb0Cdb858B2522F5826fF4'
  const donateContract = {
    addressOrName: donateAddress,
    contractInterface: abi,
  }

  const { data, isSuccess } = useContractReads({
    contracts: [
      {
        ...donateContract,
        functionName: 'getReceiptAddresses',
        chainId: 5,
      },
      {
        ...donateContract,
        functionName: 'getDonationAmounts',
        chainId: 5,
      },
    ],
  })

  if (isSuccess && data && data[0] && data[1]) {
    const receipts = data[0].map((re: string) => re)
    const amounts = data[1].map((amount: string) => ethers.utils.formatEther(amount))

    return {
      receipts: receipts,
      amounts: amounts,
    }
  }
  return {
    receipts: [],
    amounts: [],
  }
}
