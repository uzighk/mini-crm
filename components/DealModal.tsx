"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash, FloppyDisk, Buildings, CurrencyDollar, User, Note, Tag } from "@phosphor-icons/react";
import { Deal, Contact, STAGES, StageId } from "@/lib/types";

interface Props {
  deal: Deal | null;
  contacts: Contact[];
  onClose: () => void;
  onSave: (id: string, data: Partial<Deal>) => void;
  onDelete: (id: string) => void;
}

export function DealModal({ deal, contacts, onClose, onSave, onDelete }: Props) {
  const [form, setForm] = useState<Partial<Deal>>({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (deal) { setForm({ ...deal }); setConfirmDelete(false); }
  }, [deal]);

  if (!deal) return null;

  function set(key: keyof Deal, value: string | number) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const days = Math.floor((Date.now() - new Date(deal.updatedAt).getTime()) / 86400000);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(15,23,42,0.5)",
          backdropFilter: "blur(6px)",
          zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.16 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 16,
            width: 520,
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 24px 60px rgba(0,0,0,0.15)",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "22px 22px 0" }}>
            <div style={{ flex: 1 }}>
              <input
                value={form.title ?? ""}
                onChange={(e) => set("title", e.target.value)}
                style={{
                  background: "transparent", border: "none",
                  color: "#0f172a", fontSize: 17, fontWeight: 700,
                  letterSpacing: "-0.02em", width: "100%", padding: 0,
                }}
                placeholder="Nome do negócio"
              />
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
                Atualizado {days === 0 ? "hoje" : `há ${days}d`}
              </div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4 }}>
              <X size={18} />
            </button>
          </div>

          {/* Stage pills */}
          <div style={{ padding: "14px 22px 0", display: "flex", gap: 6, flexWrap: "wrap" }}>
            {STAGES.map((s) => (
              <button
                key={s.id}
                onClick={() => set("stage", s.id)}
                style={{
                  padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 500, cursor: "pointer",
                  border: form.stage === s.id ? `1.5px solid ${s.color}` : "1.5px solid #e2e8f0",
                  background: form.stage === s.id ? `${s.color}15` : "transparent",
                  color: form.stage === s.id ? s.color : "#94a3b8",
                  transition: "all 0.12s",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 13 }}>
            <Field icon={<Buildings size={14} />} label="Empresa">
              <input value={form.company ?? ""} onChange={(e) => set("company", e.target.value)} placeholder="Nome da empresa" style={iStyle} />
            </Field>
            <Field icon={<CurrencyDollar size={14} />} label="Valor (R$)">
              <input type="number" value={form.value ?? ""} onChange={(e) => set("value", parseFloat(e.target.value) || 0)} placeholder="0" style={iStyle} />
            </Field>
            <Field icon={<User size={14} />} label="Responsável">
              <input value={form.owner ?? ""} onChange={(e) => set("owner", e.target.value)} placeholder="Nome do responsável" style={iStyle} />
            </Field>
            <Field icon={<Tag size={14} />} label="Contato">
              <select
                value={form.contactId ?? ""}
                onChange={(e) => {
                  const c = contacts.find((x) => x.id === e.target.value);
                  if (c) { set("contactId", c.id); set("contactName", c.name); }
                }}
                style={{ ...iStyle, cursor: "pointer" }}
              >
                <option value="">Selecionar contato</option>
                {contacts.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.company}</option>)}
              </select>
            </Field>
            <Field icon={<Note size={14} />} label="Observações">
              <textarea value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} placeholder="Notas internas..." rows={3} style={{ ...iStyle, resize: "none", lineHeight: 1.6 }} />
            </Field>
          </div>

          {/* Actions */}
          <div style={{ padding: "0 22px 22px", display: "flex", gap: 10, justifyContent: "space-between", borderTop: "1px solid #f1f5f9", paddingTop: 16 }}>
            {confirmDelete ? (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#ef4444" }}>Confirmar?</span>
                <button onClick={() => { onDelete(deal.id); onClose(); }} style={btnDanger}>Excluir</button>
                <button onClick={() => setConfirmDelete(false)} style={btnGhost}>Cancelar</button>
              </div>
            ) : (
              <button onClick={() => setConfirmDelete(true)} style={btnGhost}>
                <Trash size={14} />
                Excluir
              </button>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={onClose} style={btnGhost}>Cancelar</button>
              <button onClick={() => { onSave(deal.id, form); onClose(); }} style={btnPrimary}>
                <FloppyDisk size={14} weight="fill" />
                Salvar
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
        <span style={{ color: "#94a3b8" }}>{icon}</span>
        <span style={{ fontSize: 11, color: "#64748b", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
      </div>
      {children}
    </div>
  );
}

const iStyle: React.CSSProperties = {
  width: "100%", background: "#f8fafc", border: "1px solid #e2e8f0",
  borderRadius: 8, padding: "9px 12px", color: "#0f172a", fontSize: 13,
};

const btnPrimary: React.CSSProperties = {
  background: "#6366f1", color: "#fff", border: "none", borderRadius: 8,
  padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer",
  display: "flex", alignItems: "center", gap: 6,
};

const btnGhost: React.CSSProperties = {
  background: "transparent", color: "#64748b", border: "1px solid #e2e8f0",
  borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer",
  display: "flex", alignItems: "center", gap: 6,
};

const btnDanger: React.CSSProperties = {
  background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca",
  borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer",
};
