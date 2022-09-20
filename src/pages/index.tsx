import React, { useState } from 'react'
import type { NextPage } from 'next'
import { Button, Heading, Text, VStack } from '@chakra-ui/react'
import { useAccount, useWaitForTransaction } from 'wagmi'
import { useIsMounted, useDonate } from '@hooks/index'
import { usePrepareContractWrite, useContractWrite } from 'wagmi'
import DonationAmount from '@components/ui/select/DonationAmount'
import ReceiptAddress from '@components/ui/select/ReceiptAddress'
import { ethers } from 'ethers'
import abi from 'abi/DonateABI'

const Home: NextPage = () => {
  const { receipts, amounts } = useDonate()
  const [receiptOption, setReceiptOption] = useState(0)
  const [amountOption, setAmountOption] = useState(0)
  const donateAddress = process.env.CONTRACT_ADDRESS || '0x153030439EC9E7D7cfdb0Cdb858B2522F5826fF4'
  const donationAmount = amounts[amountOption] || '0.01'
  const isMounted = useIsMounted()
  const { isConnected } = useAccount()
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    addressOrName: donateAddress,
    contractInterface: abi,
    functionName: 'donate',
    args: [receiptOption, amountOption],
    overrides: {
      value: ethers.utils.parseEther(donationAmount),
    },
  })

  // Hook for performing contract function
  const { data, error, isError, write } = useContractWrite(config)
  const handleDonate = () => {
    write?.()
  }
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  const handleReceiptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReceiptOption(parseInt(e.target.value))
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAmountOption(parseInt(e.target.value))
  }

  return (
    <React.Fragment>
      <VStack alignItems="center" px={8} spacing={4} textAlign="center" w="full">
        <Heading size="2xl">Welcome to Donate DApp!</Heading>
        <ReceiptAddress receipts={receipts} current={receiptOption} onSelectChange={handleReceiptChange} />
        <DonationAmount amounts={amounts} current={amountOption} onSelectChange={handleAmountChange} />
        <Button onClick={handleDonate} isDisabled={(isMounted && !isConnected) || !write || isLoading}>
          {isConnected && isLoading ? 'Donating...' : 'Donate'}
        </Button>
        {isSuccess && <Text>Thank you!</Text>}
        {(isPrepareError || isError) && (
          <Text width="full" color="tomato">
            Error: {(prepareError || error)?.message}
          </Text>
        )}
      </VStack>
    </React.Fragment>
  )
}

export default Home
