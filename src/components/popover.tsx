import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
//   PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Button,
  Portal,
  Avatar,
  Text,
  Stack,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { RouterOutputs } from "~/utils/api";

export const UserPopOver = (props: {
  user: RouterOutputs["ticket"]["tickets"][number]["requestor"];
}) => {
  const { user } = props;
  const { data: sesh } = useSession();
  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Avatar
            className="hover:cursor-pointer"
            size="md"
            name={user.name ?? ""}
            src={user.image ?? ""}
          />
        </PopoverTrigger>
        <Portal>
          <PopoverContent>
            <PopoverArrow />
            <PopoverHeader as={"b"}>{user.name} {sesh?.user.id == user.id && "(You)"}</PopoverHeader>
            <PopoverCloseButton />
            <PopoverBody>
              <Stack>
                <Text><b>Role: </b>{user.role}</Text>
                <Text><b>Email: </b>{user.email}</Text>
                <Button colorScheme="blue" as={Link} href={`/users/${user.id}`}>View Profile</Button>
              </Stack>
            </PopoverBody>
            {/* <PopoverFooter>This is the footer</PopoverFooter> */}
          </PopoverContent>
        </Portal>
      </Popover>
    </>
  );
};
