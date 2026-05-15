"use client";

import { useState, useEffect, DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, DotsSixVertical, Timer, PaintBucket, Check } from "@phosphor-icons/react";
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

const BG_PRESETS = [
  { id: "violet",    label: "Violeta",    value: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 60%, #1e1b4b 100%)" },
  { id: "ocean",     label: "Oceano",     value: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0ea5e9 100%)" },
  { id: "forest",    label: "Floresta",   value: "linear-gradient(135deg, #052e16 0%, #14532d 60%, #052e16 100%)" },
  { id: "sunset",    label: "Pôr do sol", value: "linear-gradient(135deg, #450a0a 0%, #7c2d12 45%, #1c1917 100%)" },
  { id: "rose",      label: "Rosa",       value: "linear-gradient(135deg, #500724 0%, #9f1239 50%, #500724 100%)" },
  { id: "midnight",  label: "Meia-noite", value: "linear-gradient(160deg, #09090b 0%, #18181b 100%)" },
  { id: "aurora",    label: "Aurora",     value: "linear-gradient(135deg, #134e4a 0%, #0f766e 40%, #1e1b4b 100%)" },
  { id: "slate",     label: "Slate",      value: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)" },
];

function fmtVal(v: number) {
  if (v >= 1000) return `R$ ${(v / 1000).toFixed(0)}k`;
  return `R$ ${v}`;
}

function BgPicker({ current, onChange }: { current: string; onChange: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        title="Mudar fundo"
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "7px 14px",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.18)",
          borderRadius: 20,
          color: "rgba(255,255,255,0.8)",
          fontSize: 12, fontWeight: 500,
          cursor: "pointer",
          transition: "all 0.15s",
        }}
      >
        <PaintBucket size={13} weight="duotone" />
        Fundo
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 10 }} />
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ duration: 0.14 }}
              style={{
                position: "absolute", top: "calc(100% + 8px)", right: 0,
                background: "rgba(15,23,42,0.85)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 20,
                padding: 14, width: 220, zIndex: 20,
                boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
                Tema do board
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {BG_PRESETS.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => { onChange(bg.id); setOpen(false); }}
                    style={{
                      position: "relative",
                      height: 44, borderRadius: 12,
                      background: bg.value,
                      border: current === bg.id ? "2px solid rgba(255,255,255,0.8)" : "2px solid transparent",
                      cursor: "pointer",
                      overflow: "hidden",
                      transition: "all 0.12s",
                    }}
                  >
                    {current === bg.id && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Check size={14} color="#fff" weight="bold" />
                      </div>
                    )}
                    <div style={{ position: "absolute", bottom: 4, left: 0, right: 0, textAlign: "center", fontSize: 9, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>
                      {bg.label}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function DealCard({
  deal, onClick, onDragStart,
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
        style={{ height: 2, background: "#fff", opacity: 0, margin: "1px 0", borderRadius: 2, transition: "opacity 0.1s" }}
      />
      <motion.div
        layout
        layoutId={deal.id}
        draggable
        onDragStart={(e) => onDragStart(e as unknown as DragEvent, deal.id)}
        onClick={onClick}
        style={{
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(16px) saturate(180%)",
          WebkitBackdropFilter: "blur(16px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.55)",
          borderRadius: 20,
          padding: "13px 13px 11px",
          cursor: "grab",
          marginBottom: 8,
          userSelect: "none",
          boxShadow: "0 2px 12px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.08)",
        }}
        whileHover={{
          background: "rgba(255,255,255,0.92)",
          boxShadow: "0 8px 28px rgba(0,0,0,0.14), 0 2px 6px rgba(0,0,0,0.08)",
          y: -1,
        }}
        transition={{ duration: 0.12 }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: "#1e293b", lineHeight: 1.4, flex: 1 }}>
            {deal.title}
          </span>
          <DotsSixVertical size={14} color="#cbd5e1" style={{ flexShrink: 0, marginLeft: 4, marginTop: 1 }} />
        </div>

        {deal.company && (
          <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8 }}>{deal.company}</div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {deal.value > 0 ? (
            <span style={{ fontSize: 12, fontWeight: 700, color: "#6366f1" }}>{fmtVal(deal.value)}</span>
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
                background: "rgba(99,102,241,0.12)",
                border: "1.5px solid rgba(99,102,241,0.3)",
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
    <div style={{ width: 256, minWidth: 256, display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Glass column header */}
      <div style={{
        marginBottom: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 14,
        padding: "8px 12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: stage.color, flexShrink: 0, boxShadow: `0 0 6px ${stage.color}` }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.75)", letterSpacing: "0.01em" }}>
            {stage.label}
          </span>
          <span style={{
            fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)",
            background: "rgba(255,255,255,0.08)",
            borderRadius: 10, padding: "1px 6px",
          }}>
            {deals.length}
          </span>
        </div>
        {totalValue > 0 && (
          <span style={{ fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.4)" }}>{fmtVal(totalValue)}</span>
        )}
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setActive(true); }}
        onDragLeave={() => setActive(false)}
        onDrop={(e) => { e.preventDefault(); setActive(false); onDrop(stage.id); }}
        style={{
          flex: 1, overflowY: "auto", padding: "3px 3px 4px",
          borderRadius: 24,
          border: active ? `1.5px dashed rgba(255,255,255,0.4)` : "1.5px dashed transparent",
          background: active ? "rgba(255,255,255,0.05)" : "transparent",
          transition: "all 0.15s",
        }}
      >
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} onClick={() => onCardClick(deal)} onDragStart={onDragStart} />
        ))}
        <div data-before="-1" data-column={stage.id} style={{ height: 2, opacity: 0 }} />

        <button
          onClick={onAdd}
          style={{
            marginTop: 2,
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 12px",
            borderRadius: 14,
            border: "1px dashed rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.04)",
            color: "rgba(255,255,255,0.35)",
            fontSize: 11, cursor: "pointer", width: "100%",
            transition: "all 0.15s",
            backdropFilter: "blur(8px)",
          }}
          onMouseEnter={(e) => {
            const b = e.currentTarget;
            b.style.color = "rgba(255,255,255,0.8)";
            b.style.background = "rgba(255,255,255,0.1)";
            b.style.borderColor = "rgba(255,255,255,0.35)";
          }}
          onMouseLeave={(e) => {
            const b = e.currentTarget;
            b.style.color = "rgba(255,255,255,0.35)";
            b.style.background = "rgba(255,255,255,0.04)";
            b.style.borderColor = "rgba(255,255,255,0.18)";
          }}
        >
          <Plus size={12} weight="bold" />
          Novo negócio
        </button>
      </div>
    </div>
  );
}

export function Pipeline({ deals, contacts, onMove, onUpdate, onDelete, onAdd }: Props) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [newDealStage, setNewDealStage] = useState<StageId>("leads");
  const [showNew, setShowNew] = useState(false);
  const [bgId, setBgId] = useState("violet");

  useEffect(() => {
    const saved = localStorage.getItem("crm_bg");
    if (saved) setBgId(saved);
  }, []);

  function handleBgChange(id: string) {
    setBgId(id);
    localStorage.setItem("crm_bg", id);
  }

  const bg = BG_PRESETS.find((b) => b.id === bgId)?.value ?? BG_PRESETS[0].value;

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
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: bg, transition: "background 0.5s ease" }}>
      {/* Glass top bar */}
      <div style={{
        padding: "16px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
        background: "rgba(0,0,0,0.25)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div>
          <h1 style={{ fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>
            Pipeline de Vendas
          </h1>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
            {deals.length} negócios &middot; {fmtVal(totalPipeline)} em aberto
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <BgPicker current={bgId} onChange={handleBgChange} />
          <button
            onClick={() => { setNewDealStage("leads"); setShowNew(true); }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "9px 18px",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: 20,
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.25)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
          >
            <Plus size={14} weight="bold" />
            Novo negócio
          </button>
        </div>
      </div>

      {/* Board */}
      <div style={{
        flex: 1, overflowX: "auto", overflowY: "hidden",
        padding: "22px 24px", display: "flex", gap: 14,
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
