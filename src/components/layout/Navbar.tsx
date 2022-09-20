import React from 'react'

import { Button, HStack, Icon, IconButton, Image, Link, useColorMode } from '@chakra-ui/react'

import { FaMoon } from 'react-icons/fa'
import NextLink from 'next/link'
import { useAccount, useDisconnect } from 'wagmi'
import { useIsMounted } from '@hooks/useIsMounted'

interface Props {
  onWalletOptionsOpen: () => void
}

const Navbar: React.FC<Props> = ({ onWalletOptionsOpen }) => {
  const isMounted = useIsMounted()
  const { isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <HStack as="nav" fontSize="md" p={4} spacing={0}>
      <NextLink href="/">
        <Link fontWeight="bold" href="/" p={4} variant="link">
          {colorMode === 'light' ? (
            <Image width={150} src="/logo.svg" alt="NFTLaunchKit Logo" />
          ) : (
            <Image width={150} src="/logo-white.svg" alt="NFTLaunchKit White Logo" />
          )}
        </Link>
      </NextLink>

      <HStack flexGrow={1} justify="flex-end" p={4} spacing={{ base: 0, sm: 2 }}>
        <IconButton
          aria-label="toggle dark mode"
          color="currentColor"
          icon={<Icon as={FaMoon} boxSize={5} />}
          onClick={toggleColorMode}
          variant="link"
        />
        {isMounted && isConnected ? (
          <Button as="a" target="_blank" onClick={() => disconnect()}>
            Disconnect
          </Button>
        ) : (
          <Button as="a" target="_blank" onClick={onWalletOptionsOpen}>
            Connect Wallet
          </Button>
        )}
      </HStack>
    </HStack>
  )
}

export default Navbar
