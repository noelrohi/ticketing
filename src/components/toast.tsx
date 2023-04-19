import { useToast } from "@chakra-ui/react";

type Status = "info" | "warning" | "success" | "error" | "loading" | undefined;
export function Toastt(props: {
  title: string;
  description: string;
  status: Status;
}) {
  const toast = useToast();
  return toast({
    ...props,
    duration: 9000,
    isClosable: true,
  });
}
