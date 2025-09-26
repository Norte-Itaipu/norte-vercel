import React, { ReactNode } from 'react';
import Head from 'next/head';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <>
      <Head>
        <title>Painel Administrativo</title>
      </Head>
      {children}
    </>
  );
}
