"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Kanban,
  Users,
  ChartLineUp,
  Lightning,
} from "@phosphor-icons/react";

const nav = [
  { href: "/", label: "Pipeline", icon: Kanban },
  { href: "/contatos", label: "Contatos", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: 224,
      minWidth: 224,
      background: "#0f172a",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid #1e293b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34,
            background: "linear-gradient(135deg, #6366f1, #818cf8)",
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px #6366f130",
          }}>
            <Lightning size={18} weight="fill" color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#f8fafc", letterSpacing: "-0.02em" }}>Mini CRM</div>
            <div style={{ fontSize: 11, color: "#334155", marginTop: 1 }}>Central Raposa</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "10px 10px", flex: 1 }}>
        <div style={{ fontSize: 10, color: "#1e293b", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 8px 8px" }}>
          Navegação
        </div>
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} style={{
              display: "flex", alignItems: "center", gap: 9,
              padding: "8px 10px", borderRadius: 8, marginBottom: 2,
              textDecoration: "none",
              background: active ? "#1e293b" : "transparent",
              color: active ? "#e2e8f0" : "#475569",
              fontSize: 13, fontWeight: active ? 500 : 400,
              transition: "all 0.15s",
            }}>
              <Icon size={16} weight={active ? "duotone" : "regular"} color={active ? "#818cf8" : "#334155"} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "14px 18px", borderTop: "1px solid #1e293b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <ChartLineUp size={13} color="#334155" />
          <span style={{ fontSize: 11, color: "#334155" }}>Demo — dados locais</span>
        </div>
      </div>
    </aside>
  );
}
