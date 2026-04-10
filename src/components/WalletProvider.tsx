"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

const RPC_ENDPOINT =
  process.env.NEXT_PUBLIC_RPC_URL ?? clusterApiUrl("mainnet-beta");

const queryClient = new QueryClient();

/**
 * Wraps the app with three Solana wallet adapter providers:
 *
 *   ConnectionProvider  — exposes a `Connection` via useConnection()
 *   WalletProvider      — manages wallet state; `wallets={[]}` lets the Wallet
 *                         Standard auto-detect installed extensions (Phantom,
 *                         Solflare, Backpack, etc.) without manual registration
 *   WalletModalProvider — provides the wallet selection modal
 */
export default function SolanaWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionProvider endpoint={RPC_ENDPOINT}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  );
}
