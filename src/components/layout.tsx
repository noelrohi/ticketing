import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main>
      <div className="container mx-auto p-4">{props.children}</div>
    </main>
  );
};
