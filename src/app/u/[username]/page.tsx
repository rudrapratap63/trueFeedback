"use client"
import { useParams } from "next/navigation"

function UserPage() {
  const {username} = useParams();
  return (
    <div>u page {username}</div>
  )
}

export default UserPage