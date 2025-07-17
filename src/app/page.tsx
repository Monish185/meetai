"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [name,setName] = useState("");

  const onSubmit = async () => {
    await authClient.signUp.email({
        email, // user email address
        password, // user password -> min 8 characters by default
        name, // user display name
        // A URL to redirect to after the user verifies their email (optional)
    }, {
        onSuccess: (ctx) => {
            //redirect to the dashboard or sign in page
            alert("Success")
        },
        onError: (ctx) => {
            // display the error message
            alert("Cannot sorry")
            alert(ctx.error.message);
        },
});
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
   <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full mb-2" />
   <Input value={name} onChange={e => setName(e.target.value)} placeholder="name" className="w-full mb-2" />
   <Input value={password} onChange={e => setPassword(e.target.value)} placeholder="password" className="w-full mb-2" />
    <Button onClick={onSubmit} className="m-2">Submit</Button>
    </div>
  );
}
