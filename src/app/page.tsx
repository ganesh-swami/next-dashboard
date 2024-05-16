"use client";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session }: any = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log(session);
    if (session) {
      router.push("/customer");
    } else {
      router.push("/login");
    }
  }, [session]);

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="my-8 flex grow flex-col gap-4">
        <div className="flex flex-col justify-center rounded-lg bg-gray-50 flex-wrap items-center my-6 py-8">
          <p className={`text-xl text-gray-800 md:text-2xl md:leading-normal`}>
            Please Login to process
          </p>
          <Link
            href="/login"
            className="flex items-center gap-5 mt-4 rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Log in</span>
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Add Hero Images Here */}
        </div>
      </div>
      <div>
        developed and maintained by{" "}
        <a href="https://avinyaweb.com/" className="text-blue-500">
          avinyaweb
        </a>
      </div>
    </main>
  );
}
