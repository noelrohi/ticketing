import { Spinner } from '@chakra-ui/react'
import type { ReactNode } from 'react';

export const LoadingSpinner = () => {
  return (
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size="xl"
    />
  );
};

export const LoadingProvider = (props: { children: ReactNode }) => {
  return(
    <div className="flex justify-center items-center h-screen">
      {props.children}
    </div>
  )
}