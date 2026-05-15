"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Kanban, Users, TrendingUp, Zap } from "lucide-react";

const nav = [
  { href: "/", label: "Pipeline", icon: Kanban },
  { href: "/contatos", label: "Contatos", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 220,
        minWidth: 220,
        background: "#0d0d0d",
        borderRight: "1px solid #1a1a1a",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "24px 20px 20px",
          borderBottom: "1px solid #1a1a1a",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: "#eab308",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap size={16} color="#000" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#f5f5f5", letterSpacing: "-0.02em" }}>
              Mini CRM
            </div>
            <div style={{ fontSize: 11, color: "#525252", marginTop: 1 }}>
              Central Raposa
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "12px 10px", flex: 1 }}>
        <div style={{ fontSize: 10, color: "#404040", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0 10px", marginBottom: 6 }}>
          Menu
        </div>
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                borderRadius: 8,
                marginBottom: 2,
                textDecoration: "none",
                background: active ? "#1a1a1a" : "transparent",
                color: active ? "#f5f5f5" : "#737373",
                fontSize: 13,
                fontWeight: active ? 500 : 400,
                transition: "all 0.15s",
                borderLeft: active ? "2px solid #eab308" : "2px solid transparent",
              }}
            >
              <Icon size={15} strokeWidth={active ? 2 : 1.5} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid #1a1a1a",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <TrendingUp size={13} color="#eab308" />
          <span style={{ fontSize: 11, color: "#525252" }}>
            Demo — dados locais
          </span>
        </div>
      </div>
    </aside>
  );
}
