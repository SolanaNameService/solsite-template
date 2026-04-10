"use client";

import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { DomainProfileCard } from "@/components/DomainProfileCard";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Home() {
  const { publicKey } = useWallet();
  const address = publicKey?.toBase58() ?? null;

  return (
    <>
      <header className="fixed top-0 right-0 p-4">
        <ConnectWalletButton />
      </header>

      <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            SNS App Template
          </h1>
          <p className="mt-3 text-muted">
            A minimal template for building Solana apps
          </p>
        </div>

        {address ? (
          <DomainProfileCard address={address} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { title: "Connect", desc: "Connect your wallet to get started." },
              { title: "Build", desc: "Add your components and logic here." },
              {
                title: "Ship",
                desc: "Deploy and share your app with the world.",
              },
            ].map(({ title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <h2 className="font-semibold">{title}</h2>
                <p className="mt-1 text-sm text-muted">{desc}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
