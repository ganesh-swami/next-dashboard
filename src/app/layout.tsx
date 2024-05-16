import Navbar from "@/components/Navbar";
import "./globals.css";
import type { Metadata } from "next";
// import { Inter } from "next/font/google";

import { getServerSession } from "next-auth";
import SessionProvider from "@/utils/SessionProvider";
import "react-toastify/dist/ReactToastify.min.css";
import { ToastContainer } from "react-toastify";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Khata",
  description: "handle my khata",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className="container mx-auto">
        <SessionProvider session={session}>
          <div className="mx-auto max-w-5xl gap-2 mb-10">
            <Navbar />
            {children}
          </div>
          <ToastContainer />
        </SessionProvider>
      </body>
    </html>
  );
}
