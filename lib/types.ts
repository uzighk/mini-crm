export type StageId =
  | "leads"
  | "contato"
  | "proposta"
  | "negociacao"
  | "fechado"
  | "perdido";

export interface Contact {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface Deal {
  id: string;
  title: string;
  contactId: string;
  contactName: string;
  company: string;
  value: number;
  stage: StageId;
  owner: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export const STAGES: { id: StageId; label: string; color: string }[] = [
  { id: "leads", label: "Leads", color: "#6366f1" },
  { id: "contato", label: "Contato", color: "#3b82f6" },
  { id: "proposta", label: "Proposta", color: "#eab308" },
  { id: "negociacao", label: "Negociação", color: "#f97316" },
  { id: "fechado", label: "Fechado", color: "#22c55e" },
  { id: "perdido", label: "Perdido", color: "#ef4444" },
];
