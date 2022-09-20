import React from 'react'
import { Box, Center, Divider, Stack } from '@chakra-ui/react'

const Footer: React.FC = () => {
  return (
    <Stack as="footer">
      <Box>
        <Divider />
      </Box>
      <Center pb={2}>Donate dApp for NFTLaunch</Center>
    </Stack>
  )
}

export default Footer
