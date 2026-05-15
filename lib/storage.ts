import { Contact, Deal } from "./types";

const KEYS = {
  contacts: "crm_contacts",
  deals: "crm_deals",
};

const MOCK_CONTACTS: Contact[] = [
  { id: "c1", name: "Ana Souza", company: "Grupo Meridian", email: "ana@meridian.com.br", phone: "(11) 99234-5678", createdAt: new Date(Date.now() - 30 * 86400000).toISOString() },
  { id: "c2", name: "Carlos Mendes", company: "Construlex", email: "carlos@construlex.com.br", phone: "(21) 98765-4321", createdAt: new Date(Date.now() - 20 * 86400000).toISOString() },
  { id: "c3", name: "Fernanda Lima", company: "Saúde Total", email: "fernanda@saudetotal.com.br", phone: "(31) 97654-3210", createdAt: new Date(Date.now() - 15 * 86400000).toISOString() },
  { id: "c4", name: "Roberto Alves", company: "TechForce", email: "roberto@techforce.io", phone: "(41) 96543-2109", createdAt: new Date(Date.now() - 10 * 86400000).toISOString() },
  { id: "c5", name: "Juliana Costa", company: "Empório Gourmet", email: "ju@emporiogourmet.com.br", phone: "(51) 95432-1098", createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
];

const MOCK_DEALS: Deal[] = [
  { id: "d1", title: "Automação de WhatsApp", contactId: "c1", contactName: "Ana Souza", company: "Grupo Meridian", value: 4800, stage: "proposta", owner: "Rafael", notes: "Interesse em automatizar atendimento pré-venda.", createdAt: new Date(Date.now() - 12 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "d2", title: "Sistema de Orçamentos", contactId: "c2", contactName: "Carlos Mendes", company: "Construlex", value: 12000, stage: "negociacao", owner: "Mariana", notes: "Quer integrar com o ERP atual deles.", createdAt: new Date(Date.now() - 20 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "d3", title: "Landing Page + CRM", contactId: "c3", contactName: "Fernanda Lima", company: "Saúde Total", value: 3200, stage: "contato", owner: "Rafael", notes: "Clínica com 3 unidades, quer captação de pacientes.", createdAt: new Date(Date.now() - 8 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 8 * 86400000).toISOString() },
  { id: "d4", title: "App de Delivery Interno", contactId: "c4", contactName: "Roberto Alves", company: "TechForce", value: 28000, stage: "leads", owner: "Mariana", notes: "Indicação do Carlos Mendes.", createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: "d5", title: "E-commerce + Cardápio Digital", contactId: "c5", contactName: "Juliana Costa", company: "Empório Gourmet", value: 6500, stage: "fechado", owner: "Rafael", notes: "Contrato assinado. Início na próxima semana.", createdAt: new Date(Date.now() - 25 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: "d6", title: "Redesign Institucional", contactId: "c1", contactName: "Ana Souza", company: "Grupo Meridian", value: 2200, stage: "leads", owner: "Mariana", notes: "Secundário ao projeto de WhatsApp.", createdAt: new Date(Date.now() - 6 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 6 * 86400000).toISOString() },
];

function isBrowser() {
  return typeof window !== "undefined";
}

export function getContacts(): Contact[] {
  if (!isBrowser()) return MOCK_CONTACTS;
  const raw = localStorage.getItem(KEYS.contacts);
  if (!raw) {
    localStorage.setItem(KEYS.contacts, JSON.stringify(MOCK_CONTACTS));
    return MOCK_CONTACTS;
  }
  return JSON.parse(raw);
}

export function saveContacts(contacts: Contact[]) {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.contacts, JSON.stringify(contacts));
}

export function getDeals(): Deal[] {
  if (!isBrowser()) return MOCK_DEALS;
  const raw = localStorage.getItem(KEYS.deals);
  if (!raw) {
    localStorage.setItem(KEYS.deals, JSON.stringify(MOCK_DEALS));
    return MOCK_DEALS;
  }
  return JSON.parse(raw);
}

export function saveDeals(deals: Deal[]) {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS.deals, JSON.stringify(deals));
}
