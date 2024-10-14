"use client";
import { generateMnemonic } from "bip39";
import { useRecoilState } from "recoil";
import { Seeding, Wallets, Count } from "@/RecoilStore/store";
import { useState } from "react";
import { Keypair } from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";

export default function Home() {
  const [generate, setGenerate] = useState<boolean>(false);
  const [seed, setSeed] = useRecoilState<string>(Seeding);
  const [wallets, setWallets] = useRecoilState(Wallets);
  const [count, setCount] = useRecoilState(Count);

  const clickHandler = (e:  React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (generate) return;
    setGenerate(true);
    const mnemonic = generateMnemonic();
    setSeed(mnemonic);
  };

  const KeyHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCount(count + 1);
    const path = `m/44'/501'/${count}'/0'`; 
    const derivedSeed = derivePath(path,parseInt(seed).toString(16)).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const publickey = Keypair.fromSecretKey(secret).publicKey.toBase58();
    setWallets((prev) => [
      ...prev,
      { secKey: Buffer.from(secret).toString("hex"), pubKey: publickey },
    ]);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Secret key copied to clipboard!");
  };

  const seedWords = seed ? seed.split(" ") : [];

  return (
    <div className="bg-gradient-to-b from-gray-800 to-black w-screen flex flex-col items-center justify-center text-white py-10 min-h-screen">
      <div className="text-4xl font-bold mb-8">Siuuu Wallet Generator</div>
      <button
        onClick={clickHandler}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out mb-6"
      >
        Generate Your Wallet
      </button>

      {generate && (
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-11/12 max-w-lg">
          <div className="text-lg font-semibold mb-4">Mnemonic Seed:</div>
          <div className="grid grid-cols-4 gap-4 bg-gray-800 p-3 rounded-lg text-sm mb-6">
            {seedWords.map((word, index) => (
              <div
                key={index}
                className="bg-gray-700 py-1 px-2 rounded-md text-center"
              >
                {index + 1}. {word}
              </div>
            ))}
          </div>
          <div className="text-lg font-semibold mb-4 text-center">Generate Key Pairs</div>
          <div className="flex justify-center"><button
            onClick={KeyHandler}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out mb-4 self-center"
          >
            Generate
          </button>
          </div>
          <div className="space-y-4">
            {wallets.map((item, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded-lg shadow-md text-sm"
              >
                <div className="text-green-400 font-semibold">
                  Public Key: 
                </div>
                <div>
                <span className="text-white">{item.pubKey}</span>
                </div>
                <div className="text-red-400 font-semibold flex flex-col">
                  <div>Secret Key:</div>
                  <div className="font-semibold flex items-center">
                  <div className="text-white truncate max-w-s overflow-hidden">
                    {item.secKey}
                  </div>
                  <button
                    onClick={() => handleCopy(item.secKey)}
                    className="ml-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-2 rounded-lg shadow-md transition duration-300 ease-in-out"
                  >
                    Copy
                  </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
