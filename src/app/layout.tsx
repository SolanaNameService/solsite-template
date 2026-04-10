import type { Metadata } from "next";
import type { ReactNode } from "react";
import SolanaWalletProvider from "@/components/WalletProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SNS App Template",
  description: "A minimal Solana web app template",
  keywords: ["SNS", "Solana", "web3", "blockchain", "dApp", "wallet"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SolanaWalletProvider>{children}</SolanaWalletProvider>
      </body>
    </html>
  );
}
