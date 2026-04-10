# solsite-template

A minimal Next.js template for building Solana web apps. Demonstrates wallet connection and SNS (Solana Name Service) domain + profile resolution — intended as a starting point for developers and coding agents.

## What's included

- **Wallet connection** via `@solana/wallet-adapter-react` — auto-detects installed wallets (Phantom, Solflare, Backpack, etc.) using the Wallet Standard
- **SNS profile** — resolves `.sol` domain name, profile picture, and common SNS records for the connected wallet

## Prerequisites

- [Node.js](https://nodejs.org) **v20.9 or later** (required by Next.js 16)
- A Solana wallet browser extension (e.g. [Phantom](https://phantom.app) or [Solflare](https://solflare.com))

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), click **Connect Wallet**, and approve in your wallet extension.

## Environment variables

| Variable              | Description         | Default                         |
| --------------------- | ------------------- | ------------------------------- |
| `NEXT_PUBLIC_RPC_URL` | Solana RPC endpoint | `clusterApiUrl("mainnet-beta")` |

Create a `.env.local` file to override:

```env
NEXT_PUBLIC_RPC_URL=https://your-rpc-endpoint.com
```

> **Note:** A private RPC (e.g. [Helius](https://helius.dev), [QuickNode](https://quicknode.com)) is required for reliable SNS domain resolution.

## How to extend

**Add a new page** — create `src/app/my-page/page.tsx`. Use `useWallet()` and `useConnection()` from `@solana/wallet-adapter-react` to access the connected wallet and RPC connection.

**Interact with a Solana program** — import `@solana/web3.js` and construct transactions using the `connection` from `useConnection()` and the `sendTransaction` function from `useWallet()`.

**Fetch additional SNS records** — pass extra record types to `useDomainProfile` and use `isLoading` / `error` for UI states:

**Change the network** — set `NEXT_PUBLIC_RPC_URL` to a devnet or custom endpoint:

```env
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
```

## Key packages

| Package                           | Purpose                                        |
| --------------------------------- | ---------------------------------------------- |
| `next`                            | React framework (v16)                          |
| `@solana/wallet-adapter-react`    | Wallet context and hooks                       |
| `@solana/wallet-adapter-react-ui` | Pre-built connect button and wallet modal      |
| `@solana/web3.js`                 | Solana RPC client                              |
| `@tanstack/react-query`           | Client-side query caching and request deduping |
| `@bonfida/spl-name-service`       | SNS domain and record resolution               |
| `@bonfida/sns-records`            | SNS record validation (staleness + RoA proofs) |
