"use client";

import { useDomainProfile } from "@/hooks/useDomainProfile";
import { Record as SnsRecord } from "@bonfida/spl-name-service";

const RECORD_TYPES = [
  SnsRecord.Pic,
  SnsRecord.Email,
  SnsRecord.Twitter,
  SnsRecord.Telegram,
];

function Skeleton({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-border opacity-50 ${className}`}
    />
  );
}

function LoadingRow() {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-border py-3 first:border-t-0 first:pt-0 last:pb-0">
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-5 w-32" />
    </div>
  );
}

export function DomainProfileCard({ address }: { address: string }) {
  const { data, isLoading } = useDomainProfile(address, RECORD_TYPES);

  return (
    <section className="w-full max-w-lg rounded-xl border border-border bg-surface p-6">
      <div>
        <p className="text-sm text-muted">Domain profile</p>
        <h2 className="text-xl font-semibold tracking-tight truncate">
          {isLoading ? (
            <Skeleton className="mt-1 h-6 w-32" />
          ) : data?.domain ? (
            `${data.domain}.sol`
          ) : (
            "No .sol domain"
          )}
        </h2>
      </div>

      <div className="mt-6">
        {isLoading
          ? RECORD_TYPES.map((type) => <LoadingRow key={type} />)
          : RECORD_TYPES.map((type) => {
              const record = data?.records.find((item) => item.record === type);
              const value =
                record?.verified.staleness && record.deserializedContent
                  ? String(record.deserializedContent)
                  : "-";

              return (
                <div
                  key={type}
                  className="flex items-center justify-between gap-6 border-t border-border py-3 first:border-t-0 first:pt-0 last:pb-0"
                >
                  <span className="text-sm text-muted capitalize">{type}</span>
                  <div className="flex items-center gap-2 overflow-hidden text-right text-sm text-text">
                    <span className="truncate">{value}</span>
                    {record?.verified.roa ? (
                      <span className="text-xs font-medium text-green whitespace-nowrap">
                        ✓ verified
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
      </div>
    </section>
  );
}
