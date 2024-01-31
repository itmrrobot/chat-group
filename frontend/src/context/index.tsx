import React, { createContext, useContext, useState } from "react";
import { IUser } from "../@types/user";
import { getProfileFromLS } from "../utils/auth";

interface AppContextInterface {
    profile: IUser | null;
    setProfile: React.Dispatch<React.SetStateAction<IUser | null>>;
    isAuthen: boolean;
    setIsAuthen: React.Dispatch<React.SetStateAction<boolean>>;
    isShowMess: boolean;
    setIsShowMess: React.Dispatch<React.SetStateAction<boolean>>;
}

const initalAppContext : AppContextInterface = {
    profile: getProfileFromLS(),
    setProfile: () => null,
    isAuthen: Boolean(),
    setIsAuthen: () => null,
    isShowMess: Boolean(),
    setIsShowMess: () => null,
}

export const AppContext = createContext<AppContextInterface>(initalAppContext)

export const AppProvider = ({children} : {children: React.ReactNode}) => {
    const [profile, setProfile] = useState<IUser | null>(initalAppContext.profile)
    const [isAuthen,setIsAuthen] = useState<boolean>(false);
    const [isShowMess,setIsShowMess] = useState<boolean>(false);

    return (
        <AppContext.Provider value={{ profile, setProfile,isAuthen,setIsAuthen,setIsShowMess,isShowMess}}>
            {children}
        </AppContext.Provider>
    )
}

export const AuthState = () => {
    return useContext(AppContext);
}