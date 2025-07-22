import { Button } from "@/components/ui/button";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";


export const CallEnded = () => {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-radial from-sidebar-accent to-sidebar">
        <div className="py-4 px-8">
          <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
            <div className="flex flex-col gap-y-2 text-center">
              <h6 className="text-lg font-medium">Call Ended</h6>
              <p className="text-sm text-muted-foreground">
                The call has ended. Summary will appear in a few minutes
              </p>
            </div>
            <Button asChild className="w-full">
              <Link href="/meetings">
                <ArrowLeftIcon className="size-4" />
                Back to Meetings
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  };
  