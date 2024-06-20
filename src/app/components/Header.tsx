"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";

const Header: React.FC = () => {
  const { data: session } = useSession();

  return (
    <header className="flex justify-between items-center p-4 bg-slate-800 text-white">
      {session ? (
        <div className="flex items-center">
          <img
            src={session?.user?.image ? session.user.image : ""}
            className="rounded-full w-8 h-8 mr-2"
          />
          <span>{session?.user?.name}</span>
          <button onClick={() => signOut()} className="ml-4">
            Sign out
          </button>
        </div>
      ) : (
        <button onClick={() => signIn()}>Sign in</button>
      )}
    </header>
  );
};

export default Header;
