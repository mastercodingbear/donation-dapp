// import { useEffect } from 'react'
// import { useConnect, useAccount } from 'wagmi'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  VStack,
} from '@chakra-ui/react'
import { useIsMounted } from '@hooks/index'
import { Connector, useAccount, useConnect } from 'wagmi'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const WalletOptionsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const isMounted = useIsMounted()
  const { connector } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect()

  const handleWalletConnect = (connector: Connector) => {
    connect({ connector })
    onClose()
  }

  return (
    <Modal isCentered closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Connect wallet</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack>
            {connectors
              .filter(x => isMounted && x.ready && x.id !== connector?.id)
              .map(x => (
                <Button
                  width="full"
                  key={x.id}
                  onClick={() => handleWalletConnect(x)}
                  loadingText="Connecting"
                  isLoading={isLoading && x.id === pendingConnector?.id}
                >
                  {x.name}
                </Button>
              ))}
            <Box>{error && error.message}</Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default WalletOptionsModal
