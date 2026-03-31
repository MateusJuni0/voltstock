"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Star,
  X,
  Check,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface Address {
  id: string;
  label: string;
  full_name: string;
  line1: string;
  line2: string | null;
  city: string;
  postal_code: string;
  district: string;
  phone: string | null;
  is_default: boolean;
}

type AddressFormData = Omit<Address, "id" | "is_default">;

const emptyForm: AddressFormData = {
  label: "",
  full_name: "",
  line1: "",
  line2: null,
  city: "",
  postal_code: "",
  district: "",
  phone: null,
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function MoradasPage() {
  const { user, loading: authLoading } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    if (!user) return;
    try {
      const supabase = createClient();
      const { data, error: dbError } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });

      if (dbError) {
        if (dbError.code === "42P01" || dbError.message?.includes("does not exist")) {
          setAddresses([]);
        } else {
          setError("Nao foi possivel carregar as moradas.");
        }
        return;
      }
      setAddresses(data ?? []);
    } catch {
      setError("Erro de ligacao. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user) fetchAddresses();
    if (!authLoading && !user) setLoading(false);
  }, [authLoading, user, fetchAddresses]);

  function openAddForm() {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function openEditForm(address: Address) {
    setFormData({
      label: address.label,
      full_name: address.full_name,
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      postal_code: address.postal_code,
      district: address.district,
      phone: address.phone,
    });
    setEditingId(address.id);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  }

  async function handleSave() {
    if (!user || !formData.label || !formData.full_name || !formData.line1 || !formData.city || !formData.postal_code || !formData.district) {
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      const payload = {
        ...formData,
        line2: formData.line2 || null,
        phone: formData.phone || null,
        user_id: user.id,
      };

      if (editingId) {
        const { error: dbError } = await supabase
          .from("addresses")
          .update(payload)
          .eq("id", editingId)
          .eq("user_id", user.id);

        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await supabase
          .from("addresses")
          .insert(payload);

        if (dbError) throw dbError;
      }

      closeForm();
      await fetchAddresses();
    } catch {
      setError("Erro ao guardar a morada.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!user) return;
    setDeletingId(id);
    try {
      const supabase = createClient();
      const { error: dbError } = await supabase
        .from("addresses")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (dbError) throw dbError;
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch {
      setError("Erro ao eliminar a morada.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSetDefault(id: string) {
    if (!user) return;
    try {
      const supabase = createClient();
      // Clear all defaults first
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);

      await supabase
        .from("addresses")
        .update({ is_default: true })
        .eq("id", id)
        .eq("user_id", user.id);

      await fetchAddresses();
    } catch {
      setError("Erro ao definir morada predefinida.");
    }
  }

  function updateField(field: keyof AddressFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  if (authLoading || loading) {
    return <MoradasSkeleton />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold text-accent"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            As Minhas Moradas
          </h1>
          <p className="text-sm text-accent/50 mt-1">
            Gerencie as moradas de envio
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500/80 hover:bg-orange-500 text-white text-sm font-semibold rounded-full transition-all duration-200 shadow-lg shadow-orange-500/20"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Adicionar Morada</span>
        </button>
      </div>

      {error && (
        <div className="glass-sidebar rounded-2xl p-4 mb-6 border-red-500/20">
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={() => setError(null)} className="text-red-400/50 text-xs mt-1 hover:text-red-400">
            Fechar
          </button>
        </div>
      )}

      {/* Inline form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden mb-6"
          >
            <div className="glass-sidebar rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-accent">
                  {editingId ? "Editar Morada" : "Nova Morada"}
                </h3>
                <button onClick={closeForm} className="text-accent/40 hover:text-accent transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Etiqueta" placeholder="Ex: Casa, Trabalho" value={formData.label} onChange={(v) => updateField("label", v)} required />
                <FormField label="Nome completo" placeholder="Nome e apelido" value={formData.full_name} onChange={(v) => updateField("full_name", v)} required />
                <FormField label="Morada (linha 1)" placeholder="Rua, numero, andar" value={formData.line1} onChange={(v) => updateField("line1", v)} required className="md:col-span-2" />
                <FormField label="Morada (linha 2)" placeholder="Complemento (opcional)" value={formData.line2 ?? ""} onChange={(v) => updateField("line2", v)} className="md:col-span-2" />
                <FormField label="Cidade" placeholder="Cidade" value={formData.city} onChange={(v) => updateField("city", v)} required />
                <FormField label="Codigo postal" placeholder="1000-001" value={formData.postal_code} onChange={(v) => updateField("postal_code", v)} required />
                <FormField label="Distrito" placeholder="Lisboa" value={formData.district} onChange={(v) => updateField("district", v)} required />
                <FormField label="Telefone" placeholder="+351 900 000 000" value={formData.phone ?? ""} onChange={(v) => updateField("phone", v)} />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={closeForm}
                  className="px-5 py-2.5 text-sm text-accent/60 hover:text-accent border border-white/10 rounded-full transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-orange-500/80 hover:bg-orange-500 disabled:opacity-50 text-white text-sm font-semibold rounded-full transition-all duration-200"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  {editingId ? "Guardar" : "Adicionar"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Addresses list */}
      {addresses.length === 0 && !showForm ? (
        <div className="glass-sidebar rounded-2xl p-12 text-center">
          <MapPin size={48} className="mx-auto text-accent/15 mb-5" />
          <h3 className="text-lg font-semibold text-accent/70 mb-2">
            Sem moradas guardadas
          </h3>
          <p className="text-sm text-accent/40 mb-6">
            Adicione uma morada para agilizar as suas compras.
          </p>
          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500/80 hover:bg-orange-500 text-white text-sm font-semibold rounded-full transition-all duration-200 shadow-lg shadow-orange-500/20"
          >
            <Plus size={16} />
            Adicionar Morada
          </button>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {addresses.map((address) => (
            <motion.div
              key={address.id}
              variants={itemVariants}
              className={cn(
                "glass-sidebar rounded-2xl p-5 relative transition-all duration-200",
                address.is_default && "border-orange-500/30 shadow-orange-500/5 shadow-lg"
              )}
            >
              {address.is_default && (
                <span className="absolute top-4 right-4 flex items-center gap-1 text-xs font-semibold text-orange-400">
                  <Star size={12} className="fill-orange-400" />
                  Predefinida
                </span>
              )}

              <p className="text-xs text-accent/40 uppercase tracking-wider font-semibold mb-2">
                {address.label}
              </p>
              <p className="text-sm font-semibold text-accent mb-1">
                {address.full_name}
              </p>
              <div className="text-sm text-accent/60 space-y-0.5 mb-4">
                <p>{address.line1}</p>
                {address.line2 && <p>{address.line2}</p>}
                <p>
                  {address.postal_code} {address.city}
                </p>
                <p>{address.district}</p>
                {address.phone && <p>{address.phone}</p>}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditForm(address)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs text-accent/50 hover:text-accent border border-white/10 hover:border-white/20 rounded-lg transition-colors"
                >
                  <Pencil size={12} />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  disabled={deletingId === address.id}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-400/60 hover:text-red-400 border border-white/10 hover:border-red-500/20 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deletingId === address.id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Trash2 size={12} />
                  )}
                  Eliminar
                </button>
                {!address.is_default && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-orange-400/60 hover:text-orange-400 border border-white/10 hover:border-orange-500/20 rounded-lg transition-colors"
                  >
                    <Star size={12} />
                    Predefinir
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

interface FormFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

function FormField({ label, placeholder, value, onChange, required, className }: FormFieldProps) {
  return (
    <label className={cn("block", className)}>
      <span className="text-xs text-accent/50 mb-1 block">
        {label}
        {required && <span className="text-orange-400 ml-0.5">*</span>}
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full bg-accent/5 border border-accent/10 rounded-xl py-2.5 px-4 text-sm text-accent placeholder:text-accent/25 focus:outline-none focus:border-orange-500/40 focus:bg-accent/10 transition-all"
      />
    </label>
  );
}

function MoradasSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex justify-between">
        <div>
          <div className="h-8 w-48 bg-accent/10 rounded-lg mb-2" />
          <div className="h-4 w-56 bg-accent/5 rounded-lg" />
        </div>
        <div className="h-10 w-40 bg-accent/10 rounded-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="glass-sidebar rounded-2xl p-5 h-48" />
        ))}
      </div>
    </div>
  );
}
