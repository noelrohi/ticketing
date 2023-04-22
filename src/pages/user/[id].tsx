import { Heading, StackDivider, VStack } from "@chakra-ui/react";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { PageLayout } from "~/components/layout";
import { LoadingProvider, LoadingSpinner } from "~/components/loading";
import { api } from "~/utils/api";
import { generateSSGHelper } from "~/utils/ssg";
import { TicketTable } from "..";

const ProfilePage: NextPage<{ id: string }> = ({ id }) => {
  const { data, isLoading } = api.user.getName.useQuery({
    id: id,
  });
  if(isLoading) return <LoadingProvider>Loading ..</LoadingProvider>
  if (!data ) return <div>404</div>;

  return (
    <>
      <Head>
        <title>
          {data.name}
        </title>
      </Head>
      <PageLayout>
        <VStack
          divider={<StackDivider borderColor="gray.200" />}
          spacing={4}
          align="stretch"
        >
          <Heading>Requests</Heading>
          <UserTable userId={data.id} type={"Requests"} />
          <Heading>Tasks</Heading>
          <UserTable userId={data.id} type={"Tasks"} />
        </VStack>
      </PageLayout>
    </>
  );
};

const UserTable = (props: { userId: string; type: "Requests" | "Tasks" }) => {
  const { data, isLoading } = api.ticket.ticketsBy.useQuery({
    id: props.userId,
    type: props.type,
  });

  if (isLoading) return <LoadingSpinner />;

  if (!data || data.length === 0) return <>User has no {props.type}</>;

  return <TicketTable tickets={data} />;
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;
  console.log(context.params);
  // console.log(id);

  if (typeof id !== "string") throw new Error("no id");

  await ssg.user.getName.prefetch({ id: id });
  await ssg.ticket.ticketsBy.prefetch({ id: id, type: 'Requests' });
  await ssg.ticket.ticketsBy.prefetch({ id: id, type: 'Tasks' });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
