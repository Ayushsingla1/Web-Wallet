"use client"
import { RecoilRoot } from "recoil"
export default function RecoilSetup({children} : any){
    return(
        <RecoilRoot>
            {children}
        </RecoilRoot>
    )
}