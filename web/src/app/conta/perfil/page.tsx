"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, FileText, Lock, Check, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface ProfileData {
  full_name: string;
  phone: string;
  nif: string;
}

export default function PerfilPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState<ProfileData>({
    full_name: "",
    phone: "",
    nif: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Password change
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (profile) {
      const p = profile as unknown as Record<string, unknown>;
      setFormData({
        full_name: profile.full_name ?? "",
        phone: (p.phone as string) ?? "",
        nif: (p.nif as string) ?? "",
      });
    } else if (user) {
      setFormData({
        full_name: user.user_metadata?.full_name ?? "",
        phone: user.user_metadata?.phone ?? "",
        nif: "",
      });
    }
  }, [profile, user]);

  function updateField(field: keyof ProfileData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSaveProfile() {
    if (!user) return;
    setSaving(true);
    setMessage(null);

    try {
      const supabase = createClient();

      // Upsert profile
      const { error: dbError } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          full_name: formData.full_name || null,
          phone: formData.phone || null,
          nif: formData.nif || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

      if (dbError) {
        // Table may not exist yet — try updating user metadata only
        const { error: authError } = await supabase.auth.updateUser({
          data: { full_name: formData.full_name, phone: formData.phone },
        });

        if (authError) throw authError;
      }

      setMessage({ type: "success", text: "Perfil atualizado com sucesso!" });
    } catch {
      setMessage({ type: "error", text: "Erro ao guardar as alteracoes." });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 4000);
    }
  }

  async function handleChangePassword() {
    if (newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "A palavra-passe deve ter pelo menos 6 caracteres." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "As palavras-passe nao coincidem." });
      return;
    }

    setPasswordSaving(true);
    setPasswordMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) throw error;

      setPasswordMessage({ type: "success", text: "Palavra-passe alterada com sucesso!" });
      setNewPassword("");
      setConfirmPassword("");
      setShowPassword(false);
    } catch {
      setPasswordMessage({ type: "error", text: "Erro ao alterar a palavra-passe." });
    } finally {
      setPasswordSaving(false);
      setTimeout(() => setPasswordMessage(null), 4000);
    }
  }

  if (authLoading) {
    return <PerfilSkeleton />;
  }

  const email = user?.email ?? "";
  const initials = getInitials(formData.full_name, email);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <h1
        className="text-2xl md:text-3xl font-bold text-accent mb-1"
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        O Meu Perfil
      </h1>
      <p className="text-sm text-accent/50 mb-8">Gerencie as suas informacoes pessoais</p>

      {/* Avatar + Email */}
      <div className="glass-sidebar rounded-2xl p-6 mb-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/30 to-orange-600/10 border border-orange-500/20 flex items-center justify-center text-xl font-bold text-orange-400 shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-accent truncate">
            {formData.full_name || "Sem nome definido"}
          </p>
          <p className="text-sm text-accent/40 truncate flex items-center gap-1.5">
            <Mail size={13} />
            {email}
          </p>
        </div>
      </div>

      {/* Profile form */}
      <div className="glass-sidebar rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-accent/60 uppercase tracking-wider mb-5">
          Dados pessoais
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileField
            label="Nome completo"
            icon={User}
            value={formData.full_name}
            onChange={(v) => updateField("full_name", v)}
            placeholder="O seu nome"
          />
          <ProfileField
            label="Email"
            icon={Mail}
            value={email}
            onChange={() => {}}
            placeholder=""
            disabled
          />
          <ProfileField
            label="Telefone"
            icon={Phone}
            value={formData.phone}
            onChange={(v) => updateField("phone", v)}
            placeholder="+351 900 000 000"
          />
          <ProfileField
            label="NIF"
            icon={FileText}
            value={formData.nif}
            onChange={(v) => updateField("nif", v)}
            placeholder="123456789"
          />
        </div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mt-4 flex items-center gap-2 text-sm px-4 py-3 rounded-xl border",
              message.type === "success"
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            )}
          >
            {message.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
            {message.text}
          </motion.div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-orange-500/80 hover:bg-orange-500 disabled:opacity-50 text-white text-sm font-semibold rounded-full transition-all duration-200 shadow-lg shadow-orange-500/20"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            Guardar Alteracoes
          </button>
        </div>
      </div>

      {/* Change password */}
      <div className="glass-sidebar rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-accent/60 uppercase tracking-wider">
            Seguranca
          </h2>
          {!showPassword && (
            <button
              onClick={() => setShowPassword(true)}
              className="flex items-center gap-2 text-sm text-orange-400/70 hover:text-orange-400 transition-colors"
            >
              <Lock size={14} />
              Alterar palavra-passe
            </button>
          )}
        </div>

        {showPassword && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-4"
          >
            <ProfileField
              label="Nova palavra-passe"
              icon={Lock}
              value={newPassword}
              onChange={setNewPassword}
              placeholder="Minimo 6 caracteres"
              type="password"
            />
            <ProfileField
              label="Confirmar palavra-passe"
              icon={Lock}
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Repita a palavra-passe"
              type="password"
            />

            {passwordMessage && (
              <div
                className={cn(
                  "flex items-center gap-2 text-sm px-4 py-3 rounded-xl border",
                  passwordMessage.type === "success"
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                )}
              >
                {passwordMessage.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
                {passwordMessage.text}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowPassword(false);
                  setNewPassword("");
                  setConfirmPassword("");
                  setPasswordMessage(null);
                }}
                className="px-5 py-2.5 text-sm text-accent/60 hover:text-accent border border-white/10 rounded-full transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleChangePassword}
                disabled={passwordSaving}
                className="flex items-center gap-2 px-5 py-2.5 bg-orange-500/80 hover:bg-orange-500 disabled:opacity-50 text-white text-sm font-semibold rounded-full transition-all duration-200"
              >
                {passwordSaving ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                Alterar
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function getInitials(name: string, email: string): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return "U";
}

interface ProfileFieldProps {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  type?: string;
}

function ProfileField({ label, icon: Icon, value, onChange, placeholder, disabled, type = "text" }: ProfileFieldProps) {
  return (
    <label className="block">
      <span className="text-xs text-accent/50 mb-1 block">{label}</span>
      <div className="relative">
        <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/25" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full bg-accent/5 border border-accent/10 rounded-xl py-2.5 pl-11 pr-4 text-sm text-accent placeholder:text-accent/25 focus:outline-none focus:border-orange-500/40 focus:bg-accent/10 transition-all",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
      </div>
    </label>
  );
}

function PerfilSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-8 w-40 bg-accent/10 rounded-lg mb-2" />
        <div className="h-4 w-64 bg-accent/5 rounded-lg" />
      </div>
      <div className="glass-sidebar rounded-2xl p-6 h-24" />
      <div className="glass-sidebar rounded-2xl p-6 h-64" />
      <div className="glass-sidebar rounded-2xl p-6 h-24" />
    </div>
  );
}
