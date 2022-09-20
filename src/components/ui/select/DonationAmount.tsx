import { Select } from '@chakra-ui/react'
import { useIsMounted } from '@hooks/index'
import React from 'react'

type Props = {
  amounts: string[]
  current: number
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const DonationAmount: React.FC<Props> = ({ amounts, current, onSelectChange }) => {
  const isMounted = useIsMounted()
  return (
    <Select width="xl" placeholder="Donation amount" value={current} onChange={e => onSelectChange(e)}>
      {isMounted &&
        amounts.map((amount, index) => (
          <option key={amount} value={index}>
            {amount}
          </option>
        ))}
    </Select>
  )
}

export default DonationAmount
