import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    Heading,
    Spacer,
    Text
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";

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
        {!sessionData && <Button colorScheme="teal">Log in</Button>}
        {sessionData && (
          <Text color="teal.500" fontWeight={"bold"}>
            Welcome {sessionData.user.name}!
          </Text>
        )}
      </ButtonGroup>
    </Flex>
  );
};
