import React from 'react'
import { Box, Stack } from '@chakra-ui/react'
import Navbar from './Navbar'
import Footer from './Footer'

interface Props {
  onWalletOptionsOpen: () => void
  children: React.ReactNode
}

const Layout: React.FC<Props> = ({ onWalletOptionsOpen, children }) => {
  return (
    <Stack justify="space-between" minH="100vh" spacing={0}>
      <Navbar onWalletOptionsOpen={onWalletOptionsOpen} />
      <Box as="main">{children}</Box>
      <Footer />
    </Stack>
  )
}

export default Layout
