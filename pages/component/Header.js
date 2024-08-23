"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async (e) => {
    e.preventDefault();
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('machineIp');
    localStorage.removeItem('machinePort');
    window.location.replace("/");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-slate-300 p-5">
      {/* Burger Icon for Mobile */}
      <div className="flex justify-between items-center md:hidden">
        <h1 className="text-lg font-semibold">Menu</h1>
        <button onClick={toggleMenu} className="focus:outline-none">
          <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu with Animation */}
      <div className={`fixed top-0 left-0 w-full h-full bg-slate-300 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
        <div className="flex justify-between items-center p-4">
          <h1 className="text-lg font-semibold">Menu</h1>
          <button onClick={closeMenu} className="focus:outline-none">
            <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="mt-20 flex flex-col items-center space-y-4">
          <p className={`rounded p-3 text-center transition ease-in delay-100 ${pathname === '/mesin' ? 'bg-slate-400 text-white' : 'hover:bg-slate-400 hover:text-white'}`}>
            <Link href="/mesin" onClick={closeMenu}>Mesin</Link>
          </p>
          <p className={`rounded p-3 text-center transition ease-in delay-100 ${pathname === '/absensi' ? 'bg-slate-400 text-white' : 'hover:bg-slate-400 hover:text-white'}`}>
            <Link href="/absensi" onClick={closeMenu}>Absensi</Link>
          </p>
          <p className={`rounded p-3 text-center transition ease-in delay-100 ${pathname === '/user' ? 'bg-slate-400 text-white' : 'hover:bg-slate-400 hover:text-white'}`}>
            <Link href="/user" onClick={closeMenu}>User</Link>
          </p>
          <p className={`rounded p-3 text-center transition ease-in delay-100 ${pathname === '/about' ? 'bg-slate-400 text-white' : 'hover:bg-slate-400 hover:text-white'}`}>
            <Link href="/about" onClick={closeMenu}>About</Link>
          </p>
          <p className={`rounded p-3 text-center transition ease-in delay-100 ${pathname === '/' ? 'bg-slate-400 text-white' : 'hover:bg-slate-400 hover:text-white'}`}>
            <a href="/" onClick={(e) => { closeMenu(); handleLogout(e); }}>Logout</a>
          </p>
        </div>
      </div>

      {/* Horizontal Menu for Tablet and Desktop */}
      <div className="hidden md:flex justify-end gap-12">
        <p className={`rounded p-3 transition ease-in delay-100 ${pathname === '/mesin' ? 'bg-slate-400 text-white' : 'hover:bg-slate-400 hover:text-white'}`}>
          <Link href="/mesin">Mesin</Link>
        </p>
        <p className={`rounded p-3 transition ease-in delay-100 ${pathname === '/absensi' ? 'bg-slate-400 text-white' : 'hover:bg-slate-400 hover:text-white'}`}>
          <Link href="/absensi">Absensi</Link>
        </p>
        <p className={`rounded p-3 transition ease-in delay-100 ${pathname === '/user' ? 'bg-slate-400 text-white' : 'hover:bg-slate-400 hover:text-white'}`}>
          <Link href="/user">User</Link>
        </p>
        <p className={`rounded p-3 transition ease-in delay-100 ${pathname === '/about' ? 'bg-slate-400 text-white' : 'hover:bg-slate-400 hover:text-white'}`}>
          <Link href="/about">About</Link>
        </p>
        <p className={`rounded p-3 transition ease-in delay-100 ${pathname === '/' ? 'bg-slate-400 text-white' : 'hover:bg-slate-400 hover:text-white'}`}>
          <a href="/" onClick={handleLogout}>Logout</a>
        </p>
      </div>
    </nav>
  );
}
