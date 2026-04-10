"use client";

import { Record as SnsRecord } from "@bonfida/spl-name-service";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useEffect, useRef, useState } from "react";

import { useDomainProfile } from "@/hooks/useDomainProfile";
import { shortenAddress } from "@/utils/shortenAddress";

export function ConnectWalletButton() {
  const { connected, connecting, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const address = publicKey?.toBase58() ?? null;
  const { data: sns, isLoading } = useDomainProfile(address, [SnsRecord.Pic]);

  const label = sns?.domain ?? (address ? shortenAddress(address) : "");
  const picUrl = sns?.records[0]?.deserializedContent ?? null;

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (!connected && !connecting) {
    return (
      <button className="btn" onClick={() => setVisible(true)}>
        Connect Wallet
      </button>
    );
  }

  if (connecting || isLoading) {
    return (
      <button className="btn cursor-not-allowed opacity-60" disabled>
        Connecting…
      </button>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        className="btn flex max-w-60 items-center gap-2"
        onClick={() => setOpen((o) => !o)}
      >
        {picUrl ? (
          <img
            src={picUrl}
            alt={label}
            width={20}
            height={20}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="flex size-5 items-center justify-center rounded-full bg-accent text-xs font-semibold leading-none text-white">
            {(label[0] ?? "?").toUpperCase()}
          </div>
        )}

        <span className="truncate">
          {sns?.domain ? `${sns.domain}.sol` : label}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1.5 min-w-44 rounded-lg border border-border bg-surface p-1">
          <button
            className="menu-item"
            onClick={() => {
              setOpen(false);
              setVisible(true);
            }}
          >
            Change Wallet
          </button>
          <button
            className="menu-item"
            onClick={() => {
              setOpen(false);
              disconnect();
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
