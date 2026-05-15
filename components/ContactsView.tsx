"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MagnifyingGlass, PencilSimple, Trash, X, Envelope, Phone, Buildings } from "@phosphor-icons/react";
import { Contact } from "@/lib/types";

interface Props {
  contacts: Contact[];
  onAdd: (data: Omit<Contact, "id" | "createdAt">) => void;
  onUpdate: (id: string, data: Partial<Contact>) => void;
  onDelete: (id: string) => void;
}

const EMPTY = { name: "", company: "", email: "", phone: "" };

const AVATAR_COLORS = [
  { bg: "#eef2ff", color: "#6366f1" },
  { bg: "#fdf4ff", color: "#a855f7" },
  { bg: "#ecfdf5", color: "#10b981" },
  { bg: "#fff7ed", color: "#f97316" },
  { bg: "#eff6ff", color: "#3b82f6" },
];

export function ContactsView({ contacts, onAdd, onUpdate, onDelete }: Props) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  function openNew() { setEditing(null); setForm(EMPTY); setShowForm(true); }
  function openEdit(c: Contact) { setEditing(c); setForm({ name: c.name, company: c.company, email: c.email, phone: c.phone }); setShowForm(true); }

  function handleSave() {
    if (!form.name.trim()) return;
    editing ? onUpdate(editing.id, form) : onAdd(form);
    setShowForm(false); setForm(EMPTY);
  }

  function set(k: keyof typeof EMPTY, v: string) { setForm((f) => ({ ...f, [k]: v })); }

  function avatarStyle(index: number) {
    const c = AVATAR_COLORS[index % AVATAR_COLORS.length];
    return { bg: c.bg, color: c.color };
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: "#f8fafc" }}>
      {/* Top bar */}
      <div style={{
        padding: "18px 28px", borderBottom: "1px solid #e2e8f0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0, background: "#ffffff",
      }}>
        <div>
          <h1 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.02em" }}>Contatos</h1>
          <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{contacts.length} contatos cadastrados</p>
        </div>
        <button
          onClick={openNew}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "9px 18px", background: "#6366f1", color: "#fff",
            border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
            boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
          }}
        >
          <Plus size={14} weight="bold" />
          Novo contato
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: "16px 28px 0", flexShrink: 0 }}>
        <div style={{ position: "relative", maxWidth: 380 }}>
          <MagnifyingGlass size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, empresa ou email..."
            style={{
              width: "100%", background: "#fff", border: "1px solid #e2e8f0",
              borderRadius: 8, padding: "9px 12px 9px 36px", color: "#0f172a", fontSize: 13,
              boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 28px 28px" }}>
        {/* Header row */}
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 2fr 2.5fr 1.5fr 72px",
          gap: 12, padding: "6px 14px", marginBottom: 4,
        }}>
          {["Nome", "Empresa", "Email", "Telefone", ""].map((h) => (
            <span key={h} style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {h}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <AnimatePresence>
            {filtered.map((c, i) => {
              const av = avatarStyle(i);
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    display: "grid", gridTemplateColumns: "2fr 2fr 2.5fr 1.5fr 72px",
                    gap: 12, padding: "11px 14px",
                    background: "#ffffff", border: "1px solid #f1f5f9",
                    borderRadius: 10, alignItems: "center",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: "50%",
                      background: av.bg, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, color: av.color,
                    }}>
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#1e293b" }}>{c.name}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Buildings size={12} color="#cbd5e1" />
                    <span style={{ fontSize: 12, color: "#64748b" }}>{c.company || "—"}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Envelope size={12} color="#cbd5e1" />
                    <span style={{ fontSize: 12, color: "#64748b" }}>{c.email || "—"}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Phone size={12} color="#cbd5e1" />
                    <span style={{ fontSize: 12, color: "#64748b" }}>{c.phone || "—"}</span>
                  </div>

                  <div style={{ display: "flex", gap: 5, justifyContent: "flex-end" }}>
                    {confirmDelete === c.id ? (
                      <>
                        <button onClick={() => { onDelete(c.id); setConfirmDelete(null); }} style={btnD}>
                          <Trash size={12} />
                        </button>
                        <button onClick={() => setConfirmDelete(null)} style={btnI}>
                          <X size={12} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => openEdit(c)} style={btnI}>
                          <PencilSimple size={12} />
                        </button>
                        <button onClick={() => setConfirmDelete(c.id)} style={btnI}>
                          <Trash size={12} />
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#cbd5e1", fontSize: 13 }}>
              Nenhum contato encontrado
            </div>
          )}
        </div>
      </div>

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowForm(false)}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(15,23,42,0.5)", backdropFilter: "blur(6px)",
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
                background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16,
                width: 440, boxShadow: "0 24px 60px rgba(0,0,0,0.15)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 0" }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
                  {editing ? "Editar contato" : "Novo contato"}
                </span>
                <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                  <X size={16} />
                </button>
              </div>

              <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                <input autoFocus placeholder="Nome *" value={form.name} onChange={(e) => set("name", e.target.value)} style={iSt} />
                <input placeholder="Empresa" value={form.company} onChange={(e) => set("company", e.target.value)} style={iSt} />
                <input placeholder="Email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} style={iSt} />
                <input placeholder="Telefone" value={form.phone} onChange={(e) => set("phone", e.target.value)} style={iSt} />
              </div>

              <div style={{ padding: "0 20px 20px", display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button onClick={() => setShowForm(false)} style={bG}>Cancelar</button>
                <button onClick={handleSave} style={bP}>{editing ? "Salvar" : "Criar contato"}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const iSt: React.CSSProperties = {
  width: "100%", background: "#f8fafc", border: "1px solid #e2e8f0",
  borderRadius: 8, padding: "9px 12px", color: "#0f172a", fontSize: 13,
};

const btnI: React.CSSProperties = {
  width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
  background: "transparent", border: "1px solid #f1f5f9", borderRadius: 7,
  cursor: "pointer", color: "#94a3b8",
};

const btnD: React.CSSProperties = {
  width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
  background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 7,
  cursor: "pointer", color: "#ef4444",
};

const bP: React.CSSProperties = {
  background: "#6366f1", color: "#fff", border: "none",
  borderRadius: 8, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer",
};

const bG: React.CSSProperties = {
  background: "transparent", color: "#64748b", border: "1px solid #e2e8f0",
  borderRadius: 8, padding: "8px 14px", fontSize: 13, cursor: "pointer",
};
