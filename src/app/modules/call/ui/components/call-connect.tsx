"use client";
import { useState, useEffect } from 'react';
import {
    Call,
    CallingState,
    StreamCall,
    StreamVideo,
    StreamVideoClient,
} from '@stream-io/video-react-sdk'
import { LoaderIcon } from 'lucide-react';
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useTRPC } from '@/trpc/client';
import { useMutation } from '@tanstack/react-query';
import { CallUI } from './call-ui';

interface CallConnectProps {
    meetingId: string;
    meetingName: string;
    userId: string;
    userName: string;
    userImage: string;
}

export const CallConnect = ({meetingId, meetingName, userId, userName, userImage}: CallConnectProps) => {
    const trpc = useTRPC();
    const {mutateAsync: generateToken} = useMutation(
        trpc.meetings.generateToken.mutationOptions()
    )

    const [callClient, setCallClient] = useState<StreamVideoClient | undefined>(undefined);

    useEffect(() => {
        const _client = new StreamVideoClient({
            apiKey: process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
            user: {
                id: userId,
                name: userName,
                image: userImage,
            },
            tokenProvider: generateToken,
        })

        setCallClient(_client);

        return () => {
            _client.disconnectUser();
            setCallClient(undefined);
        }

    },[userId, userName, userImage, generateToken])

    const [call, setCall] = useState<Call | undefined>(undefined);

    useEffect(() => {
        if(!callClient) return;

        const _call = callClient.call("default",meetingId);
        _call.camera.disable()
        _call.microphone.disable()
        setCall(_call);

        return () => {
            if(_call.state.callingState !== CallingState.LEFT){
                _call.leave();
                _call.endCall();
                setCall(undefined);
            }
        }
    },[callClient, meetingId])

    if(!callClient || !call) {
        return(
            <>
                <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
                    <LoaderIcon className="animate-spin text-primary size-6"/>
                </div>
            </>
        )
    }
    return(
        <>
            <StreamVideo client={callClient}>
                <StreamCall call={call}>
                    <CallUI meetingName={meetingName} />
                </StreamCall>
            </StreamVideo>
        </>
    )
}