import { atom } from "recoil";

interface wallet {
    secKey : string,
    pubKey : string
}
export const Seeding = atom({
    key : "Seeding",
    default : '' as string
})

export const Wallets = atom({
    key : "Wallets",
    default : [] as wallet[]
})

export const Count = atom({
    key : "Count",
    default : 0 as number
})