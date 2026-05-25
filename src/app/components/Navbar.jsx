'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FaPaw } from 'react-icons/fa'
import { signOut } from 'next-auth/react'

import { useTheme } from '../components/ThemeProvider'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const { user } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = async () => {
        await signOut({ redirect: false })
        toast.success("Logged out!")
        router.push("/")
        router.refresh()
    }

    const isActive = (href) =>
        pathname === href ? "text-green-700 font-semibold" : ""

    const navLinks = (
        <>
            <li>
                <Link href="/" className={isActive("/")}>Home</Link>
            </li>
            <li>
                <Link href="/pets" className={isActive("/pets")}>All Pets</Link>
            </li>
            {user && (
                <>
                    <li>
                        <Link href="/dashboard/my-requests" className={isActive("/dashboard/my-requests")}>
                            My Requests
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/add-pet" className={isActive("/dashboard/add-pet")}>
                            Add Pet
                        </Link>
                    </li>
                </>
            )}
        </>
    )

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 z-50 shadow-md bg-base-100"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="navbar max-w-7xl mx-auto px-4 flex items-center justify-between">

                {/* LEFT */}
                <div className="navbar-start">
                    {/* Mobile Menu */}
                    <div className="dropdown lg:hidden">
                        <div tabIndex={0} role="button" className="btn btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow bg-base-100 rounded-box w-60 space-y-2">
                            {navLinks}
                        </ul>
                    </div>

                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Link href="/" className="flex items-center gap-2">
                            <FaPaw className="text-3xl text-green-600" />
                            <h2 className="text-2xl font-bold text-green-600 hidden sm:block">PawHome</h2>
                        </Link>
                    </motion.div>
                </div>

                {/* CENTER */}
                <div className="navbar-center hidden lg:flex">
                    <motion.ul
                        className="menu menu-horizontal px-1 text-green-800 font-medium"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        {navLinks}
                    </motion.ul>
                </div>

                {/* RIGHT */}
                <motion.div
                    className="navbar-end gap-2 flex items-center"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="btn btn-ghost btn-circle"
                        aria-label="Toggle theme"
                    >
                        {theme === "light" ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        )}
                    </button>

                    {user ? (
                        <div className="dropdown dropdown-end">
                            <motion.div
                                tabIndex={0}
                                role="button"
                                className="avatar cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="w-10 rounded-full ring ring-green-600 ring-offset-2">
                                    <Image
                                        src={user?.image || `https://ui-avatars.com/api/?name=${user?.name}&background=22c55e&color=fff`}
                                        alt={user?.name || "user"}
                                        width={40}
                                        height={40}
                                        className="rounded-full object-cover"
                                    />
                                </div>
                            </motion.div>

                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                                <li className="px-3 py-2 border-b border-base-200 mb-1">
                                    <p className="font-semibold text-sm">{user?.name}</p>
                                    <p className="text-xs opacity-50 truncate">{user?.email}</p>
                                </li>
                                <li><Link href="/dashboard/add-pet">➕ Add Pet</Link></li>
                                <li><Link href="/dashboard/my-listings">📋 My Listings</Link></li>
                                <li><Link href="/dashboard/my-requests">🐾 My Requests</Link></li>
                                <li className="border-t border-base-200 mt-1">
                                    <button onClick={handleLogout} className="text-red-500 hover:bg-red-50">
                                        🚪 Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <motion.div
                            className="flex gap-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Link href="/login" className="btn btn-outline btn-sm border-green-700 hover:bg-green-600 text-green-900">
                                Login
                            </Link>
                            <Link href="/register" className="btn bg-green-600 text-white btn-sm">
                                Get Started
                            </Link>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    )
}