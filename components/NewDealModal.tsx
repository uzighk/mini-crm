"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, Building2, User } from "lucide-react";
import { Contact, StageId, STAGES } from "@/lib/types";

interface Props {
  open: boolean;
  defaultStage?: StageId;
  contacts: Contact[];
  onClose: () => void;
  onSave: (data: {
    title: string;
    company: string;
    value: number;
    owner: string;
    contactId: string;
    contactName: string;
    stage: StageId;
    notes: string;
  }) => void;
}

export function NewDealModal({ open, defaultStage = "leads", contacts, onClose, onSave }: Props) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [value, setValue] = useState("");
  const [owner, setOwner] = useState("");
  const [contactId, setContactId] = useState("");
  const [stage, setStage] = useState<StageId>(defaultStage);
  const [notes, setNotes] = useState("");

  function reset() {
    setTitle(""); setCompany(""); setValue(""); setOwner("");
    setContactId(""); setStage(defaultStage); setNotes("");
  }

  function handleSave() {
    if (!title.trim()) return;
    const contact = contacts.find((c) => c.id === contactId);
    onSave({
      title: title.trim(),
      company: company.trim() || contact?.company || "",
      value: parseFloat(value) || 0,
      owner: owner.trim(),
      contactId: contact?.id ?? "",
      contactName: contact?.name ?? "",
      stage,
      notes: notes.trim(),
    });
    reset();
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
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
              width: 480,
              boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 0" }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#f5f5f5" }}>Novo negócio</span>
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#525252" }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                autoFocus
                placeholder="Nome do negócio *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={iStyle}
              />

              <select
                value={contactId}
                onChange={(e) => {
                  setContactId(e.target.value);
                  const c = contacts.find((x) => x.id === e.target.value);
                  if (c && !company) setCompany(c.company);
                }}
                style={{ ...iStyle, cursor: "pointer" }}
              >
                <option value="">Selecionar contato (opcional)</option>
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} — {c.company}</option>
                ))}
              </select>

              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1, position: "relative" }}>
                  <Building2 size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#525252" }} />
                  <input placeholder="Empresa" value={company} onChange={(e) => setCompany(e.target.value)} style={{ ...iStyle, paddingLeft: 32 }} />
                </div>
                <div style={{ flex: 1, position: "relative" }}>
                  <DollarSign size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#525252" }} />
                  <input type="number" placeholder="Valor" value={value} onChange={(e) => setValue(e.target.value)} style={{ ...iStyle, paddingLeft: 32 }} />
                </div>
              </div>

              <div style={{ position: "relative" }}>
                <User size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#525252" }} />
                <input placeholder="Responsável" value={owner} onChange={(e) => setOwner(e.target.value)} style={{ ...iStyle, paddingLeft: 32 }} />
              </div>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {STAGES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStage(s.id)}
                    style={{
                      padding: "4px 12px",
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 500,
                      cursor: "pointer",
                      border: stage === s.id ? `1px solid ${s.color}` : "1px solid #222",
                      background: stage === s.id ? `${s.color}18` : "transparent",
                      color: stage === s.id ? s.color : "#525252",
                      transition: "all 0.12s",
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Observações (opcional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                style={{ ...iStyle, resize: "none", lineHeight: 1.5 }}
              />
            </div>

            <div style={{ padding: "0 20px 20px", display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={onClose} style={btnG}>Cancelar</button>
              <button onClick={handleSave} style={btnP}>Criar negócio</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const iStyle: React.CSSProperties = {
  width: "100%",
  background: "#1a1a1a",
  border: "1px solid #222",
  borderRadius: 8,
  padding: "9px 12px",
  color: "#f5f5f5",
  fontSize: 13,
};

const btnP: React.CSSProperties = {
  background: "#eab308",
  color: "#000",
  border: "none",
  borderRadius: 8,
  padding: "8px 20px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};

const btnG: React.CSSProperties = {
  background: "transparent",
  color: "#737373",
  border: "1px solid #222",
  borderRadius: 8,
  padding: "8px 16px",
  fontSize: 13,
  cursor: "pointer",
};
