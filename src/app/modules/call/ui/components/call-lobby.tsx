import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { generateAvatarUri } from "@/lib/avatar";
import { DefaultVideoPlaceholder, StreamVideoParticipant, ToggleAudioPreviewButton, ToggleVideoPreviewButton, useCallStateHooks, VideoPreview } from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { LogInIcon, XIcon } from "lucide-react";
import Link from "next/link";

interface CallLobbyProps {
    onJoin: () => void;
}

const DisabledVideoPreview = () => {
    const {data} = authClient.useSession();
    return (
        <DefaultVideoPlaceholder
            participant={
                {
                    name: data?.user?.name || "Unknown",
                    image:
                        data?.user?.image ||
                        generateAvatarUri({
                            seed: data?.user?.name || "",
                            variant: "initials",
                        }),
                } as StreamVideoParticipant
            }
        />
    )
}

const AllowBrowserPermissions = () => {
    return (
        <>
            <p className="text-sm text-muted-foreground">
                Please allow browser permissions to enable video and audio.
            </p>
        </>
    )
}

export const CallLobby = ({onJoin}: CallLobbyProps) => {
    const {useCameraState, useMicrophoneState} = useCallStateHooks();

    const {hasBrowserPermission: hasCameraPermission} = useCameraState();
    const {hasBrowserPermission: hasMicrophonePermission} = useMicrophoneState();

    const hasBrowserPermissions = hasCameraPermission && hasMicrophonePermission;

    return (
        <div className="flex h-full flex-col items-center justify-center bg-radial from-sidebar-accent to-sidebar">
             <div className="py-4 px-8 flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
                    <div className="flex flex-col gap-y-2 text-center">
                        <h6 className="text-lg font-medium">Ready to Join?</h6>
                        <p className="text-sm text-muted-foreground">Set Up Your Call before Joining</p>
                    </div>
                   <VideoPreview 
                    DisabledVideoPreview={
                        hasBrowserPermissions
                        ? DisabledVideoPreview
                        : AllowBrowserPermissions 
                    }
                   />
                   <div className="flex gap-x-2">
                    <ToggleAudioPreviewButton />
                    <ToggleVideoPreviewButton />
                   </div>
                    <div className="flex gap-x-2 justify-between w-full">
                        <Button variant="ghost" asChild>
                            <Link href={"/meetings"}>
                                <XIcon
                                    className="size-4"
                                />
                                Cancel
                            </Link>
                        </Button>
                            <Button onClick={onJoin}>
                            <LogInIcon className="size-4" />
                            Join Call
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )

}