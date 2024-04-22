"use client"

import { useSession, signIn, signOut } from "next-auth/react"

export default function MiniProfile() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center justify-between mt-14 ml-10 w-full">
      <img src={session?.user?.image || "/logo.png"} className="w-16 h-16 rounded-full border p-[2px]" alt='user profile pic' />
      <div className="flex-1 ml-4">
        <h2 className="font-bold">{session?.user?.username}</h2>
        <h3 className="text-sm text-gray-400">Welcome to insaclone</h3>
      </div>
      {session ? (
        <button className="text-blue-500 text-sm font-semibold" onClick={signOut}>Sign Out</button>
      ) : (
        <button className="text-blue-500 text-sm font-semibold" onClick={signIn}>Sign In</button>
      )}
    </div>
  )
}