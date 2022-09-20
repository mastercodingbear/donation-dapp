import { ChakraProvider, useDisclosure } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { WagmiConfig, configureChains, createClient, defaultChains } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

import Layout from '@layout/Layout'
import WalletOptionsModal from '@components/ui/modal/WalletOptionsModal'
import theme from 'theme/theme'

const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
  publicProvider(),
])

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
})

function MyApp({ Component, pageProps }: AppProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <WagmiConfig client={client}>
      <ChakraProvider theme={theme}>
        <WalletOptionsModal isOpen={isOpen} onClose={onClose} />

        <Layout onWalletOptionsOpen={onOpen}>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </WagmiConfig>
  )
}

export default MyApp
