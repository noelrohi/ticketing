import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Stack,
} from "@chakra-ui/react";

export function AssignModal(props: { ticketId: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen} variant="solid" colorScheme="blue">
        Assign
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Assign this ticket to: </ModalHeader>
          <ModalCloseButton />
          <ModalBody>{props.ticketId}</ModalBody>

          <ModalFooter>
            <Stack direction="row">
              <Button variant="ghost">Submit</Button>
              <Button variant="outline">Assign to Me</Button>

              <Button colorScheme="red" mr={3} onClick={onClose}>
                Close
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}


export function DeleteModal(props: { ticketId: string }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
      <>
        <Button onClick={onOpen} variant="solid" colorScheme="red">
          Delete
        </Button>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete this ticket? </ModalHeader>
            <ModalCloseButton />
            <ModalBody>Ticket ID: {props.ticketId}</ModalBody>
  
            <ModalFooter>
              <Stack direction="row">
                <Button variant="solid" colorScheme="red">Delete</Button>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Cancel
                </Button>
              </Stack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
  