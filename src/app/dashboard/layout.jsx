"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { HiHeart, HiPlus, HiCollection, HiMenu, HiX } from "react-icons/hi";

const links = [
    { href: "/dashboard/my-requests", label: "My Requests", icon: <HiHeart /> },
    { href: "/dashboard/add-pet",     label: "Add Pet",      icon: <HiPlus /> },
    { href: "/dashboard/my-listings", label: "My Listings",  icon: <HiCollection /> },
];

export default function DashboardLayout({ children }) {
    const { user } = useAuth();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex mt-16">

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-60 bg-white border-r border-gray-100 shadow-sm flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:mt-0 mt-16 ${open ? "translate-x-0" : "-translate-x-full"}`}>

                <div className="p-5 border-b border-gray-100">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Dashboard</p>
                    <div className="flex items-center gap-3 mt-3">
                        <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-sm font-bold shrink-0">
                            {(user?.name || user?.email || "U")[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium truncate text-gray-900">
                                {user?.name || "User"}
                            </p>
                            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-3 space-y-1">
                    {links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                                pathname === l.href
                                    ? "bg-green-50 text-green-700"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            <span className="text-base">{l.icon}</span>
                            {l.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <Link
                        href="/"
                        className="text-sm text-gray-500 hover:text-green-600 transition px-4 py-2 block"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </aside>

            {/* Overlay mobile */}
            {open && (
                <div
                    className="fixed inset-0 z-30 bg-black/30 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Main */}
            <div className="flex-1 min-w-0 flex flex-col">
                {/* Mobile header */}
                <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-16 z-20">
                    <button
                        onClick={() => setOpen(true)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                    >
                        <HiMenu size={20} />
                    </button>
                    <span className="font-bold text-gray-900">Dashboard</span>
                </header>

                <main className="flex-1 p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}