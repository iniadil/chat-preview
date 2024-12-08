import React, { Suspense } from "react";

type layoutProps = {
  children: React.ReactNode;
};

const layout: React.FC<layoutProps> = ({ children }) => {
  return <Suspense>{children}</Suspense>;
};
export default layout;
