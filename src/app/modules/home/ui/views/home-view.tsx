"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const HomeView = () => {
  const {data: session} = authClient.useSession()
    const router = useRouter()
  if(!session){
    return(
      <div>Loading......</div>
    )
  }
  return(
    <>
      <div>
       Home Page
      </div>
    </>
  )
}

export default HomeView;