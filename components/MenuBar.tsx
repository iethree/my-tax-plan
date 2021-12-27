import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import Link from 'next/link';

const NavLink = ({ href, children }: { href: string, children: any}) => {
  return (
    <Link href={href}>
      <a className={`text-yellow-500 hover:text-yellow-600 mx-3 no-underline`}>
        {children}
      </a>
    </Link>
  );
};


const NavBar: NextPage = () => {
  return (
    <nav className="fixed top-0 left-0 w-screen bg-indigo-900 px-4 py-2 shadow-sm flex justify-between items-center">
      <Link href="/">
        <a>
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