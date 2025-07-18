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
        <p>Logged in as {session?.user?.name}</p>
        <Button onClick={() => authClient.signOut({fetchOptions :{onSuccess: () => router.push("/auth/sign-in")}})}>Sign Out</Button>
      </div>
    </>
  )
}

export default HomeView;