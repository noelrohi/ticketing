import {
    Text,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    useDisclosure
} from "@chakra-ui/react";
import { CreateTicket } from "./form/TicketForm";

export function CreateDrawer() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Text onClick={onOpen}>
        Create a Ticket
      </Text>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={'lg'}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create Ticket</DrawerHeader>

          <DrawerBody>
            <CreateTicket className="p-4" />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
