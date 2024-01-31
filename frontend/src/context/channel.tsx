import React, { createContext, useContext, useState } from "react";
import { IChannel } from "../@types/channel";

interface ChannelContextInterface {
    channel: IChannel | null;
    setChannel: React.Dispatch<React.SetStateAction<IChannel | null>>;
    isClickChannel: boolean;
    setIsClickChannel: React.Dispatch<React.SetStateAction<boolean>>;
}

const initalAppContext : ChannelContextInterface = {
    channel: null,
    setChannel: () => null,
    isClickChannel: Boolean(),
    setIsClickChannel: () => null,
}

export const ChannelContext = createContext<ChannelContextInterface>(initalAppContext)

export const ChannelProvider = ({children} : {children: React.ReactNode}) => {
    const [channel, setChannel] = useState<IChannel | null>(initalAppContext.channel)
    const [isClickChannel,setIsClickChannel] = useState<boolean>(false);

    return (
        <ChannelContext.Provider value={{ channel, setChannel,isClickChannel,setIsClickChannel}}>
            {children}
        </ChannelContext.Provider>
    )
}

export const ChannelState = () => {
    return useContext(ChannelContext);
}