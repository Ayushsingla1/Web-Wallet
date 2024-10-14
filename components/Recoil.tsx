"use client"
import { ReactNode } from "react"
import { RecoilRoot } from "recoil"
type RecoilSetupProps = {
    children: ReactNode;
}
export default function RecoilSetup({children}:RecoilSetupProps){
    return(
        <RecoilRoot>
            {children}
        </RecoilRoot>
    )
}