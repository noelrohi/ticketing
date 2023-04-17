import {
    Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { Category } from "@prisma/client";
import { useSession } from "next-auth/react";
import { Controller } from "react-hook-form";
import { TicketSchema } from "~/schema/Ticket";
import { api } from "~/utils/api";
import { useZodForm } from "~/utils/useZodForm";

export const CreateTicket = (props: {className : string}) => {
  const methods = useZodForm({
    schema: TicketSchema,
  });

  const utils = api.useContext();
  const createTicket = api.ticket.create.useMutation({
    onSettled: async () => {
      await utils.ticket.invalidate();
      methods.reset();
    },
  });

  const onSubmit = methods.handleSubmit(
    (data) => {
        createTicket.mutate(data);
    },
    (e) => {
      console.log(e)
      console.log("Whoops... something went wrong!");
      console.error(e);
    }
  );
  const { data: session } = useSession();

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form action="" onSubmit={onSubmit} className={props.className}>
      <FormControl className="space-y-2">
        <FormLabel htmlFor="subject">Subject</FormLabel>
        <Input type="text" {...methods.register("subject")} />
        <FormErrorMessage>
          {methods.formState.errors.subject?.message}
        </FormErrorMessage>

        <FormLabel htmlFor="description">Description</FormLabel>
        <Textarea {...methods.register("description")} />
        <FormErrorMessage>
          {methods.formState.errors.description?.message}
        </FormErrorMessage>

        <FormLabel htmlFor="category">Category</FormLabel>

        <Controller
          control={methods.control}
          name="category"
          render={({ field }) => (
            <Select
              value={field.value}
              onChange={field.onChange}
              placeholder="Select a category"
            >
              {Object.entries(Category).map(([key, value]) => (
                <option key={key} value={value}>
                  {value.replaceAll('_', ' ')}
                </option>
              ))}
            </Select>
          )}
        />
        <FormErrorMessage>
          {methods.formState.errors.category?.message}
        </FormErrorMessage>
        <Button type="submit" disabled={!session}>
          {!session
            ? "Sign in to Create"
            : createTicket.isLoading
            ? "Loading..."
            : "Create"}
        </Button>
        <p className="font-medium text-red-500">{createTicket.error?.message}</p>
      </FormControl>
    </form>
  );
};
