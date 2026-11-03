"use client";
import { NETWORKS, socialHandle, socialHref } from "@/lib/store/social";
import { SOCIAL_ICONS } from "../site/SocialIcons";

type Accounts = Partial<Record<string, string>>;

/** The accounts a store actually has, in display order — never an empty row */
export const presentNetworks = (accounts: Accounts) => NETWORKS.filter((n) => accounts[n.key]);

/** Large chips under "Follow us": the network's colour, its icon, name and handle */
export function SocialChips({ accounts, edit }: { accounts: Accounts; edit?: boolean }) {
  const list = presentNetworks(accounts);
  if (!list.length) return null;
  return (
    <div className="ss-chips" {...(edit ? { "data-edit": "social" } : {})}>
      {list.map((n) => (
        <a key={n.key} className="ss-chip" href={socialHref(n.key, accounts[n.key]!)} target="_blank" rel="noopener noreferrer" style={{ ["--net" as string]: n.color }} aria-label={n.label}>
          <span className="ss-ic">{SOCIAL_ICONS[n.key]}</span>
          <span className="ss-t"><b>{n.label}</b><small className="ltr">{n.key === "whatsapp" ? `+${accounts[n.key]!.replace(/\D/g, "")}` : socialHandle(accounts[n.key]!)}</small></span>
        </a>
      ))}
    </div>
  );
}

/** A compact row of round icons for the store footer */
export function SocialBar({ accounts, title, edit }: { accounts: Accounts; title: string; edit?: boolean }) {
  const list = presentNetworks(accounts);
  if (!list.length) return null;
  return (
    <div className="ss-bar" {...(edit ? { "data-edit": "social" } : {})}>
      <span className="ss-bar-t">{title}</span>
      <div className="ss-bar-i">
        {list.map((n) => (
          <a key={n.key} href={socialHref(n.key, accounts[n.key]!)} target="_blank" rel="noopener noreferrer" style={{ ["--net" as string]: n.color }} aria-label={n.label} title={n.label}>
            {SOCIAL_ICONS[n.key]}
          </a>
        ))}
      </div>
    </div>
  );
}
