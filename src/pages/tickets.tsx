import {
  Avatar,
  Badge,
  Center,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { LoadingProvider, LoadingSpinner } from "~/components/loading";
import { AssignModal, DateTargetModal, DeleteModal } from "~/components/modal";
import { UserPopOver } from "~/components/popover";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Tickets</title>
        <meta name="description" content="Tickets" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="container mx-auto p-4">
          <TicketTable />
        </div>
      </main>
    </>
  );
};

const TicketTable = () => {
  const { data, isLoading } = api.ticket.tickets.useQuery();
  // const user = ();
  const { data: sesh } = useSession();
  if (isLoading)
    return (
      <LoadingProvider>
        <LoadingSpinner />
      </LoadingProvider>
    );
  if (!data) return <LoadingProvider>404</LoadingProvider>;

  return (
    <>
      {data.length == 0 ? (
        <Center>Nothing to Display!</Center>
      ) : (
        <TableContainer>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Subject</Th>
                <Th>Category</Th>
                <Th>Status</Th>
                <Th>Requestor</Th>
                <Th>Assignee</Th>
                <Th>Date Created</Th>
                <Th>Date Target</Th>

                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.map((ticket) => {
                return (
                  <Tr key={ticket.id}>
                    <Td>{ticket.subject}</Td>
                    <Td>{ticket.category.replaceAll("_", " ")}</Td>
                    <Td>
                      <Badge
                        colorScheme={
                          ticket.status == "TBA"
                            ? "purple"
                            : ticket.status == "IN_PROGRESS"
                            ? "orange"
                            : ticket.status == "OPEN"
                            ? "cyan"
                            : "red"
                        }
                      >
                        {ticket.status.replaceAll("_", " ")}
                      </Badge>
                    </Td>
                    <Td>
                      <UserPopOver user={ticket.requestor} />
                    </Td>
                    <Td>
                      {ticket.assignee ? (
                        <UserPopOver user={ticket.assignee} />
                      ) : (
                        <Avatar name="?" />
                      )}
                    </Td>
                    <Td>{ticket.createdAt.toDateString()} </Td>
                    <Td>
                      {ticket.target?.toDateString() ?? (
                        <DateTargetModal ticketId={ticket.id} />
                      )}{" "}
                    </Td>

                    <Td>
                      <Stack direction={"row"} placeItems={"center"}>
                        {sesh?.user.id === ticket.requestorId && (
                          <AssignModal
                            ticketId={ticket.id}
                            isDisabled={typeof ticket.assignedTo == "string"}
                          />
                        )}
                        {sesh?.user.id === ticket.requestorId && (
                          <DeleteModal ticketId={ticket.id} />
                        )}
                      </Stack>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
            {/* <Tfoot>
                  <Tr>
                    <Th>Subject</Th>
                    <Th>Category</Th>
                    <Th>Status</Th>
                    <Th>Requestor</Th>
                    <Th>Assignee</Th>
                    <Th>Action</Th>
                  </Tr>
                </Tfoot> */}
          </Table>
        </TableContainer>
      )}
    </>
  );
};
export default Home;
