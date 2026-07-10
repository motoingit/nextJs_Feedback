"use client"

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import {User} from 'next-auth'
import { Button } from '@base-ui/react/button'

const Navbar = () => {

  const {data: session, status} = useSession();
  const user = session?.user as User;

  return (
    <nav className="flex justify-between items-center bg-card px-8 py-4">
      <div>
        <Link href="#">
          True Feedback
        </Link>
        {
          session ? (
            <>
              <span>Welcome, {user?.username || user?.email}</span>
              <Button onClick={()=>signOut()}> LogOut</Button>
            </>
          ) : (
            <>
              <a href="/sign-in">LogIn</a>
            </>
          )
        }
        
      </div>
    </nav>
  )
}

export default Navbar
