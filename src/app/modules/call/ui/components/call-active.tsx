import { CallControls, SpeakerLayout } from "@stream-io/video-react-sdk";
import Image from "next/image";
import Link from "next/link";

interface CallActiveProps {
    onLeave: () => void;
    meetingName: string;
}

export const CallActive = ({onLeave, meetingName}: CallActiveProps) => {
    return (
        <div className="flex flex-col justify-between h-full text-white">
            <div className="bg-[#101213] rounded-full p-4 flex items-center gap-4">
                <Link href={"/"} className="flex items-center justify-center p-1 bg-white/10 rounded-full w-fit">
                    <Image src={"/logo.svg"} alt="logo" width={24} height={24} />
                </Link>
                <h4 className="text-base font-semibold ">
                    {meetingName}
                </h4>
            </div>
            <SpeakerLayout />
            <div className="bg-[#101213] rounded-full px-4">
                <CallControls onLeave={onLeave} />
            </div>

        </div>
    )
}