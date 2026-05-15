"use client";

import { useState, DragEvent } from "react";
import { motion } from "framer-motion";
import { Plus, DotsSixVertical, Timer } from "@phosphor-icons/react";
import { Deal, Contact, STAGES, StageId } from "@/lib/types";
import { DealModal } from "./DealModal";
import { NewDealModal } from "./NewDealModal";

interface Props {
  deals: Deal[];
  contacts: Contact[];
  onMove: (id: string, stage: StageId) => void;
  onUpdate: (id: string, data: Partial<Deal>) => void;
  onDelete: (id: string) => void;
  onAdd: (data: Omit<Deal, "id" | "createdAt" | "updatedAt">) => void;
}

function fmtVal(v: number) {
  if (v >= 1000) return `R$ ${(v / 1000).toFixed(0)}k`;
  return `R$ ${v}`;
}

function DealCard({
  deal,
  onClick,
  onDragStart,
}: {
  deal: Deal;
  onClick: () => void;
  onDragStart: (e: DragEvent, id: string) => void;
}) {
  const days = Math.floor((Date.now() - new Date(deal.updatedAt).getTime()) / 86400000);
  const daysColor = days > 7 ? "#ef4444" : days > 3 ? "#f97316" : "#94a3b8";

  return (
    <>
      <div
        data-before={deal.id}
        data-column={deal.stage}
        style={{ height: 2, background: "#6366f1", opacity: 0, margin: "1px 0", borderRadius: 2, transition: "opacity 0.1s" }}
      />
      <motion.div
        layout
        layoutId={deal.id}
        draggable
        onDragStart={(e) => onDragStart(e as unknown as DragEvent, deal.id)}
        onClick={onClick}
        style={{
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: 10,
          padding: "12px 12px 10px",
          cursor: "grab",
          marginBottom: 6,
          userSelect: "none",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
        whileHover={{ borderColor: "#c7d2fe", boxShadow: "0 4px 12px rgba(99,102,241,0.08)" }}
        transition={{ duration: 0.12 }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12.5, fontWeight: 500, color: "#1e293b", lineHeight: 1.4, flex: 1 }}>
            {deal.title}
          </span>
          <DotsSixVertical size={14} color="#cbd5e1" style={{ flexShrink: 0, marginLeft: 4, marginTop: 1 }} />
        </div>

        {deal.company && (
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8 }}>{deal.company}</div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {deal.value > 0 ? (
            <span style={{ fontSize: 12, fontWeight: 600, color: "#6366f1" }}>
              {fmtVal(deal.value)}
            </span>
          ) : (
            <span style={{ fontSize: 11, color: "#e2e8f0" }}>—</span>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {days > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Timer size={11} color={daysColor} />
                <span style={{ fontSize: 10, color: daysColor, fontWeight: 500 }}>{days}d</span>
              </div>
            )}
            {deal.owner && (
              <div style={{
                width: 22, height: 22, borderRadius: "50%",
                background: "#eef2ff",
                border: "1.5px solid #c7d2fe",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 700, color: "#6366f1",
              }}>
                {deal.owner.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

function Column({
  stage, deals, onDragStart, onDrop, onCardClick, onAdd,
}: {
  stage: typeof STAGES[0];
  deals: Deal[];
  contacts: Contact[];
  onDragStart: (e: DragEvent, id: string) => void;
  onDrop: (stage: StageId) => void;
  onCardClick: (deal: Deal) => void;
  onAdd: () => void;
}) {
  const [active, setActive] = useState(false);
  const totalValue = deals.reduce((s, d) => s + d.value, 0);

  return (
    <div style={{ width: 252, minWidth: 252, display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: stage.color, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#475569", letterSpacing: "0.01em" }}>
            {stage.label}
          </span>
          <span style={{
            fontSize: 10, fontWeight: 600, color: "#94a3b8",
            background: "#f1f5f9", border: "1px solid #e2e8f0",
            borderRadius: 10, padding: "1px 6px",
          }}>
            {deals.length}
          </span>
        </div>
        {totalValue > 0 && (
          <span style={{ fontSize: 10, fontWeight: 500, color: "#94a3b8" }}>{fmtVal(totalValue)}</span>
        )}
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setActive(true); }}
        onDragLeave={() => setActive(false)}
        onDrop={(e) => { e.preventDefault(); setActive(false); onDrop(stage.id); }}
        style={{
          flex: 1, overflowY: "auto", padding: "3px 3px 8px",
          borderRadius: 10,
          border: `1.5px dashed ${active ? stage.color + "80" : "transparent"}`,
          background: active ? `${stage.color}06` : "transparent",
          transition: "all 0.15s",
        }}
      >
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} onClick={() => onCardClick(deal)} onDragStart={onDragStart} />
        ))}
        <div data-before="-1" data-column={stage.id} style={{ height: 2, opacity: 0 }} />
      </div>

      {/* Add button */}
      <button
        onClick={onAdd}
        style={{
          marginTop: 6,
          display: "flex", alignItems: "center", gap: 6,
          padding: "7px 10px",
          borderRadius: 8,
          border: "1.5px dashed #e2e8f0",
          background: "transparent",
          color: "#cbd5e1",
          fontSize: 11, cursor: "pointer", width: "100%",
          transition: "all 0.12s",
        }}
        onMouseEnter={(e) => {
          const b = e.currentTarget;
          b.style.color = "#6366f1"; b.style.borderColor = "#c7d2fe"; b.style.background = "#eef2ff";
        }}
        onMouseLeave={(e) => {
          const b = e.currentTarget;
          b.style.color = "#cbd5e1"; b.style.borderColor = "#e2e8f0"; b.style.background = "transparent";
        }}
      >
        <Plus size={12} weight="bold" />
        Novo negócio
      </button>
    </div>
  );
}

export function Pipeline({ deals, contacts, onMove, onUpdate, onDelete, onAdd }: Props) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [newDealStage, setNewDealStage] = useState<StageId>("leads");
  const [showNew, setShowNew] = useState(false);

  function handleDragStart(e: DragEvent, id: string) {
    e.dataTransfer.setData("dealId", id);
    setDraggingId(id);
  }

  function handleDrop(stage: StageId) {
    if (draggingId) { onMove(draggingId, stage); setDraggingId(null); }
  }

  const totalPipeline = deals
    .filter((d) => d.stage !== "fechado" && d.stage !== "perdido")
    .reduce((s, d) => s + d.value, 0);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: "#f8fafc" }}>
      {/* Top bar */}
      <div style={{
        padding: "18px 28px",
        borderBottom: "1px solid #e2e8f0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0, background: "#ffffff",
      }}>
        <div>
          <h1 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.02em" }}>
            Pipeline de Vendas
          </h1>
          <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
            {deals.length} negócios &middot; {fmtVal(totalPipeline)} em aberto
          </p>
        </div>
        <button
          onClick={() => { setNewDealStage("leads"); setShowNew(true); }}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "9px 18px",
            background: "#6366f1",
            color: "#fff",
            border: "none", borderRadius: 8,
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
            transition: "all 0.15s",
          }}
        >
          <Plus size={14} weight="bold" />
          Novo negócio
        </button>
      </div>

      {/* Board */}
      <div style={{
        flex: 1, overflowX: "auto", overflowY: "hidden",
        padding: "22px 28px", display: "flex", gap: 14,
      }}>
        {STAGES.map((stage) => (
          <Column
            key={stage.id}
            stage={stage}
            deals={deals.filter((d) => d.stage === stage.id)}
            contacts={contacts}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onCardClick={setSelectedDeal}
            onAdd={() => { setNewDealStage(stage.id); setShowNew(true); }}
          />
        ))}
      </div>

      <DealModal
        deal={selectedDeal}
        contacts={contacts}
        onClose={() => setSelectedDeal(null)}
        onSave={onUpdate}
        onDelete={onDelete}
      />
      <NewDealModal
        open={showNew}
        defaultStage={newDealStage}
        contacts={contacts}
        onClose={() => setShowNew(false)}
        onSave={onAdd}
      />
    </div>
  );
}
