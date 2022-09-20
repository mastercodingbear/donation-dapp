import { Select } from '@chakra-ui/react'
import { useIsMounted } from '@hooks/index'
import React from 'react'

type Props = {
  receipts: string[]
  current: number
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const ReceiptAddress: React.FC<Props> = ({ receipts, current, onSelectChange }) => {
  const isMounted = useIsMounted()
  return (
    <Select width="xl" placeholder="Receipt address" value={current} onChange={e => onSelectChange(e)}>
      {isMounted &&
        receipts.map((receipt, index) => (
          <option key={receipt} value={index}>
            {receipt}
          </option>
        ))}
    </Select>
  )
}

export default ReceiptAddress
