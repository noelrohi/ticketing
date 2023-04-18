import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";

export const Nav = () => {
  const { data: sessionData } = useSession();

  return (
    <Flex
      minWidth="max-content"
      alignItems="center"
      gap="2"
      p="2"
      shadow={"md"}
    >
      <Box p="2">
        <Heading size="md">Ticketing System</Heading>
      </Box>

      <Spacer />

      <ButtonGroup gap="2">
        <Stack direction={"row"} placeItems={"center"}>
          {sessionData && (
            <Text color="teal.500" fontWeight={"bold"}>
              Welcome {sessionData.user.name}!
            </Text>
          )}
          <Button
            colorScheme="teal"
            size={'sm'}
            onClick={sessionData ? () => void signOut() : () => void signIn()}
          >
            {sessionData ? "Sign Out" : "Sign In"}
          </Button>
        </Stack>
      </ButtonGroup>
    </Flex>
  );
};
