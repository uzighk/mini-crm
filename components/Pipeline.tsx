"use client";

import { useState, DragEvent } from "react";
import { motion } from "framer-motion";
import { Plus, GripVertical } from "lucide-react";
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

function daysBadge(updatedAt: string) {
  const d = Math.floor((Date.now() - new Date(updatedAt).getTime()) / 86400000);
  if (d === 0) return null;
  const color = d > 7 ? "#ef4444" : d > 3 ? "#f97316" : "#737373";
  return <span style={{ fontSize: 10, color, fontWeight: 500 }}>{d}d</span>;
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
  return (
    <>
      <div
        data-before={deal.id}
        data-column={deal.stage}
        style={{ height: 2, background: "#eab308", opacity: 0, margin: "1px 0", borderRadius: 2, transition: "opacity 0.1s" }}
      />
      <motion.div
        layout
        layoutId={deal.id}
        draggable
        onDragStart={(e) => onDragStart(e as unknown as DragEvent, deal.id)}
        onClick={onClick}
        style={{
          background: "#161616",
          border: "1px solid #1f1f1f",
          borderRadius: 10,
          padding: "12px 12px 10px",
          cursor: "grab",
          marginBottom: 6,
          userSelect: "none",
        }}
        whileHover={{ borderColor: "#2a2a2a", background: "#1a1a1a" }}
        transition={{ duration: 0.1 }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: "#e5e5e5", lineHeight: 1.4, flex: 1 }}>
            {deal.title}
          </span>
          <GripVertical size={12} color="#333" style={{ flexShrink: 0, marginLeft: 4, marginTop: 2 }} />
        </div>

        {deal.company && (
          <div style={{ fontSize: 11, color: "#525252", marginBottom: 8 }}>{deal.company}</div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {deal.value > 0 ? (
            <span style={{ fontSize: 11, fontWeight: 600, color: "#eab308" }}>
              {fmtVal(deal.value)}
            </span>
          ) : (
            <span style={{ fontSize: 11, color: "#333" }}>—</span>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {daysBadge(deal.updatedAt)}
            {deal.owner && (
              <div style={{
                width: 20, height: 20, borderRadius: "50%",
                background: "#222", border: "1px solid #2a2a2a",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 700, color: "#eab308",
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
  stage,
  deals,
  contacts,
  onDragStart,
  onDrop,
  onCardClick,
  onAdd,
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

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    setActive(true);
  }

  function handleDragLeave() {
    setActive(false);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setActive(false);
    onDrop(stage.id);
  }

  return (
    <div
      style={{ width: 240, minWidth: 240, display: "flex", flexDirection: "column", height: "100%" }}
    >
      {/* Column header */}
      <div style={{ marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: stage.color }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#a3a3a3", letterSpacing: "0.02em" }}>
            {stage.label}
          </span>
          <span style={{
            fontSize: 10, fontWeight: 600, color: "#404040",
            background: "#1a1a1a", border: "1px solid #222",
            borderRadius: 10, padding: "1px 6px",
          }}>
            {deals.length}
          </span>
        </div>
        {totalValue > 0 && (
          <span style={{ fontSize: 10, color: "#525252" }}>{fmtVal(totalValue)}</span>
        )}
      </div>

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "4px 4px 8px",
          borderRadius: 10,
          border: `1px dashed ${active ? stage.color + "60" : "transparent"}`,
          background: active ? `${stage.color}08` : "transparent",
          transition: "all 0.15s",
          minHeight: 60,
        }}
      >
        {deals.map((deal) => (
          <DealCard
            key={deal.id}
            deal={deal}
            onClick={() => onCardClick(deal)}
            onDragStart={onDragStart}
          />
        ))}
        <div
          data-before="-1"
          data-column={stage.id}
          style={{ height: 2, opacity: 0 }}
        />
      </div>

      {/* Add button */}
      <button
        onClick={onAdd}
        style={{
          marginTop: 8,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 10px",
          borderRadius: 8,
          border: "1px dashed #222",
          background: "transparent",
          color: "#404040",
          fontSize: 11,
          cursor: "pointer",
          width: "100%",
          transition: "all 0.12s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "#737373";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#2a2a2a";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "#404040";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#222";
        }}
      >
        <Plus size={12} />
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
    if (draggingId) {
      onMove(draggingId, stage);
      setDraggingId(null);
    }
  }

  const totalPipeline = deals
    .filter((d) => d.stage !== "fechado" && d.stage !== "perdido")
    .reduce((s, d) => s + d.value, 0);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      {/* Top bar */}
      <div style={{
        padding: "20px 28px",
        borderBottom: "1px solid #1a1a1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: "#f5f5f5", letterSpacing: "-0.03em" }}>
            Pipeline de Vendas
          </h1>
          <p style={{ fontSize: 12, color: "#525252", marginTop: 2 }}>
            {deals.length} negócios · {fmtVal(totalPipeline)} em aberto
          </p>
        </div>
        <button
          onClick={() => { setNewDealStage("leads"); setShowNew(true); }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 18px",
            background: "#eab308",
            color: "#000",
            border: "none",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Plus size={14} strokeWidth={2.5} />
          Novo negócio
        </button>
      </div>

      {/* Board */}
      <div style={{
        flex: 1,
        overflowX: "auto",
        overflowY: "hidden",
        padding: "24px 28px",
        display: "flex",
        gap: 16,
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
