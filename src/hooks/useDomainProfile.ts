import { useQuery } from "@tanstack/react-query";

import {
  getAllDomains,
  getMultipleRecordsV2,
  getPrimaryDomain,
  Record,
  type RecordResult,
  reverseLookup,
} from "@bonfida/spl-name-service";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, type Connection } from "@solana/web3.js";

export interface SnsProfile {
  domain: string | null;
  records: RecordResult[];
}

export interface UseSnsResult {
  data: SnsProfile | null;
  isLoading: boolean;
}

/**
 * Resolve the best-available SNS domain for a wallet.
 *
 * @param connection Solana RPC connection used for SNS lookups.
 * @param address Base58-encoded wallet address.
 * @returns Domain name without the `.sol` suffix, or `null` when none can be resolved.
 */
async function fetchPrimary(
  connection: Connection,
  address: string,
): Promise<string | null> {
  const pubkey = new PublicKey(address);

  try {
    const { reverse, stale } = await getPrimaryDomain(connection, pubkey);
    if (reverse && !stale) return reverse;
  } catch {
    // Fall through to owned-domain lookup.
  }

  try {
    const domains = await getAllDomains(connection, pubkey);
    if (domains.length > 0) return await reverseLookup(connection, domains[0]);
  } catch {
    // No owned domain found.
  }

  return null;
}

/**
 * Fetch SNS records for a resolved SNS domain.
 *
 * @param connection Solana RPC connection used for record resolution.
 * @param domain Resolved SNS domain without the `.sol` suffix.
 * @param recordTypes SNS record keys to request.
 * @returns Only defined record results returned by the SNS SDK.
 */
async function fetchRecords(
  connection: Connection,
  domain: string,
  recordTypes: Record[],
): Promise<RecordResult[]> {
  const fetched = await getMultipleRecordsV2(connection, domain, recordTypes, {
    deserialize: true,
  });

  return fetched.filter(
    (record): record is RecordResult => record !== undefined,
  );
}

/**
 * Resolve SNS profile data for a wallet address.
 *
 * The hook performs two dependent queries:
 * 1. Resolve the wallet's primary or first owned SNS domain.
 * 2. Fetch the requested SNS records for that domain.
 *
 * @param address Base58 wallet address, or `null`/`undefined` when disconnected.
 * @param recordTypes SNS record keys to fetch for the resolved domain.
 * @returns Current loading state plus the resolved domain and record data.
 */
export function useDomainProfile(
  address: string | null | undefined,
  recordTypes: Record[],
): UseSnsResult {
  const { connection } = useConnection();

  const primaryQuery = useQuery({
    queryKey: ["snsDomain", address],
    enabled: Boolean(address),
    queryFn: async () => fetchPrimary(connection, address!),
  });

  const recordsQuery = useQuery({
    queryKey: ["snsRecords", primaryQuery.data, recordTypes],
    enabled: Boolean(address && primaryQuery.data),
    queryFn: async () =>
      fetchRecords(connection, primaryQuery.data!, recordTypes),
  });

  const isLoading = primaryQuery.isLoading || recordsQuery.isLoading;

  if (!address) {
    return { data: null, isLoading: false };
  }

  return {
    data: {
      domain: primaryQuery.data ?? null,
      records: recordsQuery.data ?? [],
    },
    isLoading,
  };
}
