"use client";

import { Sidebar } from "@/components/Sidebar";
import { Pipeline } from "@/components/Pipeline";
import { useCRM } from "@/hooks/useCRM";

export default function Home() {
  const { contacts, deals, loaded, addDeal, updateDeal, deleteDeal, moveDeal } = useCRM();

  if (!loaded) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a" }}>
        <div style={{ width: 24, height: 24, border: "2px solid #222", borderTopColor: "#eab308", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  return (
    <>
      <Sidebar />
      <Pipeline
        deals={deals}
        contacts={contacts}
        onMove={moveDeal}
        onUpdate={updateDeal}
        onDelete={deleteDeal}
        onAdd={(data) => addDeal(data)}
      />
    </>
  );
}
