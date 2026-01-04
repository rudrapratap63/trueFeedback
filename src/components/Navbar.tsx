"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { User } from "next-auth"
import { Button } from "./ui/button"

export const Navbar = () => {
   const {data: session} = useSession();
   const user: User = session?.user as User;
   return (
      <nav className="p-4 md:p-6 shadow-md">
         <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <a href="#">Mystry Message</a>
            {
               session ? (
                  <div>
                     <span className="mr-4">Welcome, {user?.username || user?.email}</span>
                     <Button className="w-full md:m-auto cursor-pointer" onClick={() => signOut()}>Logout</Button>
                  </div>
               ) : (
                  <Link href={'/sign-in'}>
                     <Button className="w-full md:w-auto">Login</Button>
                  </Link>
               )
            }
         </div>
      </nav>
   )
}
