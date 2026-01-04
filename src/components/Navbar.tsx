"use client"

import React from 'react'
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { User } from "next-auth"
import { Button } from "./ui/button"
import { ShieldCheck, LogOut, User as UserIcon } from "lucide-react"

export const Navbar = () => {
   const { data: session } = useSession();
   const user: User = session?.user as User;

   return (
      <nav className="sticky top-0 z-50 w-full border-b border-slate-900 bg-slate-950/80 backdrop-blur-xl">
          <div className="container mx-auto flex justify-between items-center px-6 md:px-24 py-4">
            <Link 
               href="/" 
               className="flex items-center gap-2 text-xl font-bold tracking-tighter text-white hover:opacity-90 transition-opacity"
            >
               <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-500/20">
                  <ShieldCheck className="w-5 h-5 text-white" />
               </div>
               <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                  True Feedback
               </span>
            </Link>

            <div className="flex items-center gap-4">
               {session ? (
                  <div className="flex items-center gap-4">
                     <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
                        <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-sm font-medium text-slate-300">
                           {user?.username || user?.email}
                        </span>
                     </div>
                     <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-slate-400 hover:text-white hover:bg-red-500/10 transition-all"
                        onClick={() => signOut()}
                     >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                     </Button>
                  </div>
               ) : (
                  <Link href='/sign-in'>
                     <Button 
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 rounded-md transition-all duration-300 shadow-lg shadow-indigo-500/20"
                     >
                        Login
                     </Button>
                  </Link>
               )}
            </div>
          </div>
      </nav>
   )
}