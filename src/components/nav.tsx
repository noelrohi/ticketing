import { ChevronDownIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Heading,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { CreateDrawer } from "./drawer";
import type { ReactNode } from "react";

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
        <Heading size="md" as={Link} href={"/"}>
          Ticketing System
        </Heading>
      </Box>
      {sessionData && (
        <>
          <Heading size="sm" className="hover:cursor-pointer">
            <CreateDrawer />
          </Heading>
          <Box p="2">
            <Heading size="sm" className="hover:cursor-pointer">
              <Menu isLazy closeOnSelect={false}>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  variant={"ghost"}
                >
                  Actions
                </MenuButton>
                <MenuList>
                  <MenuItem></MenuItem>
                  <MenuItem>My Tickets</MenuItem>
                  <MenuItem>My Tasks</MenuItem>
                </MenuList>
              </Menu>
            </Heading>
          </Box>
        </>
      )}

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
            size={"sm"}
            onClick={sessionData ? () => void signOut() : () => void signIn()}
          >
            {sessionData ? "Sign Out" : "Sign In"}
          </Button>
        </Stack>
      </ButtonGroup>
    </Flex>
  );
};

export const ChakraNav = () => {
  // const Links = [];

  const NavLink = ({ children }: { children: ReactNode }) => (
    <Link
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      href={"#"}
    >
      {children}
    </Link>
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: sessionData } = useSession();

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box>
              <Heading size="md" as={Link} href={"/"}>
                Ticketing System
              </Heading>
            </Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              <Button>
                <CreateDrawer />
              </Button>
              {/* {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))} */}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            {sessionData ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar size={"sm"} src={sessionData.user.image ?? ""} />
                </MenuButton>
                <MenuList>
                  <MenuItem>{sessionData.user.name}</MenuItem>
                  <MenuItem as={Link} href={`/user/${sessionData.user.id}`}>Profile</MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={() => void signOut()}>Sign Out</MenuItem>
                </MenuList>
              </Menu>
            ) : (
              <Button
                colorScheme="teal"
                size={"sm"}
                onClick={() => void signIn()}
              >
                Sign In
              </Button>
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              <NavLink>
                <CreateDrawer />
              </NavLink>

              {/* {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))} */}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};
