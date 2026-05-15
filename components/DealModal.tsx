"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, DollarSign, Building2, User, FileText, Tag } from "lucide-react";
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
    if (deal) setForm({ ...deal });
  }, [deal]);

  if (!deal) return null;

  function set(key: keyof Deal, value: string | number) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSave() {
    onSave(deal!.id, form);
    onClose();
  }

  const daysSince = Math.floor(
    (Date.now() - new Date(deal.updatedAt).getTime()) / 86400000
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(4px)",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#111111",
            border: "1px solid #222",
            borderRadius: 16,
            width: 520,
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              padding: "24px 24px 0",
            }}
          >
            <div>
              <input
                value={form.title ?? ""}
                onChange={(e) => set("title", e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#f5f5f5",
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  width: "100%",
                  padding: 0,
                }}
                placeholder="Nome do negócio"
              />
              <div style={{ fontSize: 12, color: "#525252", marginTop: 4 }}>
                Atualizado há {daysSince === 0 ? "hoje" : `${daysSince}d`}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#525252",
                display: "flex",
                padding: 4,
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Stage pills */}
          <div style={{ padding: "16px 24px 0", display: "flex", gap: 6, flexWrap: "wrap" }}>
            {STAGES.map((s) => (
              <button
                key={s.id}
                onClick={() => set("stage", s.id)}
                style={{
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 500,
                  cursor: "pointer",
                  border: form.stage === s.id ? `1px solid ${s.color}` : "1px solid #222",
                  background: form.stage === s.id ? `${s.color}18` : "transparent",
                  color: form.stage === s.id ? s.color : "#525252",
                  transition: "all 0.12s",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            <Field icon={<Building2 size={14} />} label="Empresa">
              <input
                value={form.company ?? ""}
                onChange={(e) => set("company", e.target.value)}
                placeholder="Nome da empresa"
                style={inputStyle}
              />
            </Field>

            <Field icon={<DollarSign size={14} />} label="Valor (R$)">
              <input
                type="number"
                value={form.value ?? ""}
                onChange={(e) => set("value", parseFloat(e.target.value) || 0)}
                placeholder="0"
                style={inputStyle}
              />
            </Field>

            <Field icon={<User size={14} />} label="Responsável">
              <input
                value={form.owner ?? ""}
                onChange={(e) => set("owner", e.target.value)}
                placeholder="Nome do responsável"
                style={inputStyle}
              />
            </Field>

            <Field icon={<Tag size={14} />} label="Contato">
              <select
                value={form.contactId ?? ""}
                onChange={(e) => {
                  const c = contacts.find((x) => x.id === e.target.value);
                  if (c) {
                    set("contactId", c.id);
                    set("contactName", c.name);
                  }
                }}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option value="">Selecionar contato</option>
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.company}
                  </option>
                ))}
              </select>
            </Field>

            <Field icon={<FileText size={14} />} label="Observações">
              <textarea
                value={form.notes ?? ""}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Notas internas sobre este negócio..."
                rows={3}
                style={{ ...inputStyle, resize: "none", lineHeight: 1.5 }}
              />
            </Field>
          </div>

          {/* Actions */}
          <div
            style={{
              padding: "0 24px 24px",
              display: "flex",
              gap: 10,
              justifyContent: "space-between",
            }}
          >
            {confirmDelete ? (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#ef4444" }}>Confirmar exclusão?</span>
                <button
                  onClick={() => { onDelete(deal.id); onClose(); }}
                  style={{ ...btnDanger, padding: "6px 14px", fontSize: 12 }}
                >
                  Excluir
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  style={{ ...btnGhost, padding: "6px 14px", fontSize: 12 }}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                style={btnGhost}
              >
                <Trash2 size={14} />
                Excluir
              </button>
            )}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={onClose} style={btnGhost}>
                Cancelar
              </button>
              <button onClick={handleSave} style={btnPrimary}>
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
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <span style={{ color: "#525252" }}>{icon}</span>
        <span style={{ fontSize: 11, color: "#525252", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#1a1a1a",
  border: "1px solid #222",
  borderRadius: 8,
  padding: "9px 12px",
  color: "#f5f5f5",
  fontSize: 13,
  transition: "border-color 0.12s",
};

const btnPrimary: React.CSSProperties = {
  background: "#eab308",
  color: "#000",
  border: "none",
  borderRadius: 8,
  padding: "8px 20px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

const btnGhost: React.CSSProperties = {
  background: "transparent",
  color: "#737373",
  border: "1px solid #222",
  borderRadius: 8,
  padding: "8px 16px",
  fontSize: 13,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 6,
};

const btnDanger: React.CSSProperties = {
  background: "#ef444420",
  color: "#ef4444",
  border: "1px solid #ef444440",
  borderRadius: 8,
  padding: "8px 16px",
  fontSize: 13,
  cursor: "pointer",
};
