"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Pencil, Trash2, X, Mail, Phone, Building2 } from "lucide-react";
import { Contact } from "@/lib/types";

interface Props {
  contacts: Contact[];
  onAdd: (data: Omit<Contact, "id" | "createdAt">) => void;
  onUpdate: (id: string, data: Partial<Contact>) => void;
  onDelete: (id: string) => void;
}

const EMPTY = { name: "", company: "", email: "", phone: "" };

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

  function openNew() {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
  }

  function openEdit(c: Contact) {
    setEditing(c);
    setForm({ name: c.name, company: c.company, email: c.email, phone: c.phone });
    setShowForm(true);
  }

  function handleSave() {
    if (!form.name.trim()) return;
    if (editing) {
      onUpdate(editing.id, form);
    } else {
      onAdd(form);
    }
    setShowForm(false);
    setForm(EMPTY);
  }

  function set(k: keyof typeof EMPTY, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

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
            Contatos
          </h1>
          <p style={{ fontSize: 12, color: "#525252", marginTop: 2 }}>
            {contacts.length} contatos cadastrados
          </p>
        </div>
        <button
          onClick={openNew}
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
          Novo contato
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: "16px 28px 0", flexShrink: 0 }}>
        <div style={{ position: "relative", maxWidth: 360 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#404040" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, empresa ou email..."
            style={{
              width: "100%",
              background: "#111",
              border: "1px solid #1f1f1f",
              borderRadius: 8,
              padding: "9px 12px 9px 36px",
              color: "#f5f5f5",
              fontSize: 13,
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 28px 28px" }}>
        {/* Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 2fr 2fr 1fr 80px",
          gap: 12,
          padding: "8px 12px",
          marginBottom: 4,
        }}>
          {["Nome", "Empresa", "Email", "Telefone", ""].map((h) => (
            <span key={h} style={{ fontSize: 10, color: "#404040", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {h}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <AnimatePresence>
            {filtered.map((c) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 2fr 2fr 1fr 80px",
                  gap: 12,
                  padding: "12px 12px",
                  background: "#111",
                  border: "1px solid #1a1a1a",
                  borderRadius: 8,
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "#1a1a1a", border: "1px solid #222",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, color: "#eab308", flexShrink: 0,
                  }}>
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#e5e5e5" }}>{c.name}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Building2 size={12} color="#404040" />
                  <span style={{ fontSize: 12, color: "#737373" }}>{c.company || "—"}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Mail size={12} color="#404040" />
                  <span style={{ fontSize: 12, color: "#737373" }}>{c.email || "—"}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Phone size={12} color="#404040" />
                  <span style={{ fontSize: 12, color: "#737373" }}>{c.phone || "—"}</span>
                </div>

                <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                  {confirmDelete === c.id ? (
                    <>
                      <button onClick={() => { onDelete(c.id); setConfirmDelete(null); }} style={btnDanger}>
                        <Trash2 size={12} />
                      </button>
                      <button onClick={() => setConfirmDelete(null)} style={btnIcon}>
                        <X size={12} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => openEdit(c)} style={btnIcon}>
                        <Pencil size={12} />
                      </button>
                      <button onClick={() => setConfirmDelete(c.id)} style={btnIcon}>
                        <Trash2 size={12} />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#404040", fontSize: 13 }}>
              Nenhum contato encontrado
            </div>
          )}
        </div>
      </div>

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowForm(false)}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(4px)",
              zIndex: 50,
              display: "flex", alignItems: "center", justifyContent: "center",
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
                width: 440,
                boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 0" }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#f5f5f5" }}>
                  {editing ? "Editar contato" : "Novo contato"}
                </span>
                <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#525252" }}>
                  <X size={16} />
                </button>
              </div>

              <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                <input autoFocus placeholder="Nome *" value={form.name} onChange={(e) => set("name", e.target.value)} style={iStyle} />
                <input placeholder="Empresa" value={form.company} onChange={(e) => set("company", e.target.value)} style={iStyle} />
                <input placeholder="Email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} style={iStyle} />
                <input placeholder="Telefone" value={form.phone} onChange={(e) => set("phone", e.target.value)} style={iStyle} />
              </div>

              <div style={{ padding: "0 20px 20px", display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button onClick={() => setShowForm(false)} style={btnG}>Cancelar</button>
                <button onClick={handleSave} style={btnP}>{editing ? "Salvar" : "Criar contato"}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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

const btnIcon: React.CSSProperties = {
  width: 28, height: 28,
  display: "flex", alignItems: "center", justifyContent: "center",
  background: "transparent",
  border: "1px solid #1f1f1f",
  borderRadius: 6,
  cursor: "pointer",
  color: "#525252",
};

const btnDanger: React.CSSProperties = {
  width: 28, height: 28,
  display: "flex", alignItems: "center", justifyContent: "center",
  background: "#ef444420",
  border: "1px solid #ef444440",
  borderRadius: 6,
  cursor: "pointer",
  color: "#ef4444",
};

const btnP: React.CSSProperties = {
  background: "#eab308", color: "#000", border: "none",
  borderRadius: 8, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer",
};

const btnG: React.CSSProperties = {
  background: "transparent", color: "#737373", border: "1px solid #222",
  borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer",
};
