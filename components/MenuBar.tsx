import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import Link from 'next/link';

const NavLink = ({ href, children }: { href: string, children: any}) => {
  const router =  useRouter();
  const active = router?.pathname === href;

  return (
    <Link href={href} as={href}>
      <a className={`text-lg text-yellow-500 hover:text-yellow-600 mx-3 ${active ? 'underline' : 'no-underline'}`}>
        {children}
      </a>
    </Link>
  );
};

const NavBar: NextPage = () => {
  return (
    <nav className="fixed top-0 left-0 w-screen bg-indigo-900 px-4 py-2 shadow-sm flex justify-between items-center">
      <Link href="/">
        <a className="text-xl no-underline">
          <i className="fas fa-coins mr-2 text-yellow-500" />
          My Tax Plan
        </a>
      </Link>
      <div className="flex justify-end">
        <NavLink href="/build">
          Builder
        </NavLink>
        <NavLink href="/about">
          About
        </NavLink>
      </div>
    </nav>
  )
}

export default NavBar