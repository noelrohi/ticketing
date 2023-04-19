import {
  Avatar,
  Button,
  Input,
  Kbd,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { api, type RouterOutputs } from "~/utils/api";
import { LoadingProvider } from "./loading";

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
        console.log(data);
        await utils.ticket.invalidate();
        console.log(data, error);
      },
    });

  const { data: session } = useSession();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data, isLoading } = api.user.getAll.useQuery();
  const [user, setUser] = useState<string>("");
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
          <ModalBody>
            {isLoading ? (
              <LoadingProvider>Loading Users ...</LoadingProvider>
            ) : (
              <Select
                placeholder="Select option"
                disabled={!data}
                onChange={(e) => setUser(e.target.value)}
              >
                {data?.map((user) => {
                  return (
                    <option value={user.id} key={user.id}>
                      {user.name}
                    </option>
                  );
                })}
              </Select>
            )}
          </ModalBody>

          <ModalFooter>
            <Stack direction="row">
              <Button
                variant="ghost"
                onClick={() =>
                  assignTicket({
                    id: props.ticketId,
                    userId: user,
                  })
                }
              >
                {assigning ? "Assigning..." : "Submit"}
              </Button>
              {session && (
                <Button
                  variant="outline"
                  onClick={() => setUser(session.user.id)}
                >
                  Assign To Me
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

export function DateTargetModal(props: { ticketId: string }) {
  const { data: session } = useSession();
  const utils = api.useContext();
  const { mutate, isLoading } = api.ticket.addDateTarget.useMutation({
    onSettled: async (data, error) => {
      await utils.ticket.invalidate();
      console.log(data, error);
    },
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [input, setInput] = useState(new Date());
  return (
    <>
      <Button onClick={onOpen} variant="ghost" colorScheme="green" size={"sm"}>
        Modify
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modify Date Target</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <Text>
                <b>Ticket ID: </b>
                <Kbd>{props.ticketId}</Kbd>
              </Text>

              <Input
                placeholder="Select Date and Time"
                size="md"
                type="date"
                onChange={(e) => setInput(new Date(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    mutate({ date: input, id: props.ticketId });
                  }
                }}
              />
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Stack direction="row">
              {session && (
                <Button
                  colorScheme="blue"
                  onClick={() => mutate({ date: input, id: props.ticketId })}
                  isLoading={isLoading}
                >
                  Submit
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

export const UserModal = (props: {
  user: RouterOutputs["ticket"]["tickets"][number]["requestor"];
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = props;

  return (
    // <Stack direction={"row"} placeItems={"center"}>
    //   <Avatar
    //     size="md"
    //     name={ticket.requestor.name ?? ""}
    //     src={ticket.requestor.image ?? ""}
    //   />

    //   <Text as={"b"}>{ticket.requestor.name}</Text>
    <>
      <Avatar
        className="hover:cursor-pointer"
        size="md"
        name={user.name ?? ""}
        src={user.image ?? ""}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modify Date Target</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{user.name}</ModalBody>

          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
