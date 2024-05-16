"use client";
import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session }: any = useSession();
  console.log(session);
  return (
    <div className="mt-4 mb-8">
      <ul className="flex justify-between item-center">
        <div className="flex gap-10">
          {!session ? (
            <>
              <Link href="/login">
                <li>Login</li>
              </Link>
              {/* <Link href="/register">
                <li>Register</li>
              </Link> */}
            </>
          ) : (
            <>
              {/* {session.user?.email} */}
              <Link href="/customer" className="p-2 px-5 font-bold">
                <li>Customers</li>
              </Link>
            </>
          )}
        </div>
        <div>
          {session ? (
            <button
              onClick={() => {
                signOut();
              }}
              className="p-2 px-5 -mt-1 bg-red-600 hover:bg-red-800 text-white rounded-full"
            >
              Logout
            </button>
          ) : (
            <></>
          )}
        </div>
      </ul>
    </div>
  );
};

export default Navbar;
