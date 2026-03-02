import { ReactNode } from "react";

export default function ActivityLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <>
      {/* 确实同时渲染了children和modal路由段，
    但是modal槽中default.tsx返回空， 
    所以默认只展示了children*/}
      {children}
      {modal}
    </>
  );
}
