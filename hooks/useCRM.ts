"use client";

import { useState, useEffect, useCallback } from "react";
import { Contact, Deal, StageId } from "@/lib/types";
import { getContacts, saveContacts, getDeals, saveDeals } from "@/lib/storage";

export function useCRM() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setContacts(getContacts());
    setDeals(getDeals());
    setLoaded(true);
  }, []);

  const addContact = useCallback((data: Omit<Contact, "id" | "createdAt">) => {
    const contact: Contact = {
      ...data,
      id: `c${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setContacts((prev) => {
      const next = [...prev, contact];
      saveContacts(next);
      return next;
    });
    return contact;
  }, []);

  const updateContact = useCallback((id: string, data: Partial<Contact>) => {
    setContacts((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, ...data } : c));
      saveContacts(next);
      return next;
    });
  }, []);

  const deleteContact = useCallback((id: string) => {
    setContacts((prev) => {
      const next = prev.filter((c) => c.id !== id);
      saveContacts(next);
      return next;
    });
    setDeals((prev) => {
      const next = prev.filter((d) => d.contactId !== id);
      saveDeals(next);
      return next;
    });
  }, []);

  const addDeal = useCallback((data: Omit<Deal, "id" | "createdAt" | "updatedAt">) => {
    const deal: Deal = {
      ...data,
      id: `d${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDeals((prev) => {
      const next = [...prev, deal];
      saveDeals(next);
      return next;
    });
    return deal;
  }, []);

  const updateDeal = useCallback((id: string, data: Partial<Deal>) => {
    setDeals((prev) => {
      const next = prev.map((d) =>
        d.id === id ? { ...d, ...data, updatedAt: new Date().toISOString() } : d
      );
      saveDeals(next);
      return next;
    });
  }, []);

  const deleteDeal = useCallback((id: string) => {
    setDeals((prev) => {
      const next = prev.filter((d) => d.id !== id);
      saveDeals(next);
      return next;
    });
  }, []);

  const moveDeal = useCallback((id: string, stage: StageId) => {
    setDeals((prev) => {
      const next = prev.map((d) =>
        d.id === id ? { ...d, stage, updatedAt: new Date().toISOString() } : d
      );
      saveDeals(next);
      return next;
    });
  }, []);

  return {
    contacts,
    deals,
    loaded,
    addContact,
    updateContact,
    deleteContact,
    addDeal,
    updateDeal,
    deleteDeal,
    moveDeal,
  };
}
