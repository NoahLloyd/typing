"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { User, LogOut } from "lucide-react";

const Header: React.FC = () => {
  const { data: session } = useSession();

  const handleUserClick = () => {
    // Navigate to the user's page
    // Replace with your routing logic, e.g., useRouter().push('/user')
  };

  return (
    <header className="flex justify-between items-center mt-8 text-white">
      <span className="font-medium tracking-wider text-2xl">XTYPE</span>
      {session ? (
        <div className="flex items-center">
          <div
            onClick={handleUserClick}
            className="flex items-center cursor-pointer hover:bg-slate-900 transition-colors duration-200 p-2 rounded mr-4"
          >
            <User className="mr-2" size={24} />
            <span className="">{session?.user?.name}</span>
          </div>
          <div
            onClick={() => signOut()}
            className="cursor-pointer hover:bg-slate-900 transition-colors p-3 duration-200 rounded"
          >
            <LogOut size={18} />
          </div>
        </div>
      ) : (
        <button
          onClick={() => signIn()}
          className="hover:bg-slate-900 transition-colors duration-200 p-2 rounded"
        >
          Sign in
        </button>
      )}
    </header>
  );
};

export default Header;
