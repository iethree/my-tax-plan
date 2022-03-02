import { useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { supabase } from "@/utils/api";
import useStore from "@/utils/useStore";

const NavLink = ({ href, children }: { href: string; children: any }) => {
  const router = useRouter();
  const active = router?.pathname === href;

  return (
    <Link href={href} as={href}>
      <a
        className={`text-lg text-yellow-500 hover:text-yellow-600 mx-3 ${
          active ? "underline" : "no-underline"
        }`}
      >
        {children}
      </a>
    </Link>
  );
};

const NavBar: NextPage = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-screen bg-indigo-900 px-4 py-2 shadow-sm flex justify-between items-center z-50">
      <Link href="/">
        <a className="text-xl no-underline">
          <i className="fas fa-coins mr-2 text-yellow-500" />
          My Tax Plan
        </a>
      </Link>
      <div className="justify-end">
        <div className="hidden md:flex">
          <NavLinks />
        </div>

        <button
          className="block md:hidden text-yellow-500 hover:text-yellow-600"
          onClick={() => setShowMobileMenu((show) => !show)}
        >
          <i className="fas fa-bars mr-2 fa-xl" />
        </button>
      </div>
      {showMobileMenu && (
        <div
          onClick={() => setShowMobileMenu(false)}
          className="fixed top-0 right-0 mt-10 p-5 bg-indigo-900 flex flex-col h-48 justify-between items-center z-40 rounded-b-lg shadow-lg"
        >
          <NavLinks />
        </div>
      )}
    </nav>
  );
};

export function NavLinks() {
  const user = useStore((state) => state.user);

  return (
    <>
      <NavLink href="/build">Builder</NavLink>
      <NavLink href="/budget">Budget</NavLink>
      <NavLink href="/about">About</NavLink>
      {!!user && (
        <button
          className="text-lg text-indigo-400 mx-3"
          onClick={() => supabase.auth.signOut()}
        >
          Logout
        </button>
      )}
    </>
  );
}

export default NavBar;
