import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';

export default function ModalConfirmacionDelete({ isOpen, onClose, handleDeleteConfirm }: any) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirmar eliminación</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          ¿Estás seguro que querés eliminar este producto?
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={3}>
            Cancelar
          </Button>
          <Button
            colorScheme="red"
            onClick={() => {
              handleDeleteConfirm();
              onClose();
            }}
          >
            Eliminar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
