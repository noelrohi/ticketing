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
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

// const utils = api.useContext();
// const { mutate: closeTicket, isLoading: closing } =
//   api.ticket.close.useMutation({
//     onSettled: async (data, error) => {
//       await utils.ticket.invalidate();
//       console.log(data, error);
//     },
//   });

export function AssignModal(props: { ticketId: string }) {
  const utils = api.useContext();
  const { mutate: assignTicket, isLoading: assigning } =
    api.ticket.assign.useMutation({
      onSettled: async (data, error) => {
        await utils.ticket.invalidate();
        console.log(data, error);
      },
    });

  const { data: session } = useSession();

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen} variant="solid" colorScheme="blue" size={"sm"}>
        Assign
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Assign this ticket to: </ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>

          <ModalFooter>
            <Stack direction="row">
              <Button variant="ghost">Submit</Button>
              {session && (
                <Button
                  variant="outline"
                  onClick={() =>
                    assignTicket({
                      id: props.ticketId,
                      userId: session.user.id,
                    })
                  }
                >
                  {assigning ? "Assigning..." : "Assign To Me"}
                </Button>
              )}

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
  const { data: session } = useSession();
  const utils = api.useContext();
  const { mutate: deleteTicket, isLoading: deleting } =
    api.ticket.delete.useMutation({
      onSettled: async (data, error) => {
        await utils.ticket.invalidate();
        console.log(data, error);
      },
    });
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen} variant="solid" colorScheme="red" size={"sm"}>
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
              {session && (
                <Button
                  colorScheme="red"
                  onClick={() =>
                    deleteTicket({
                      id: props.ticketId,
                    })
                  }
                >
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
              )}

              <Button colorScheme="gray" mr={3} onClick={onClose}>
                Close
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
