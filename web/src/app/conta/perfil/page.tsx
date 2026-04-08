"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, FileText, Lock, Check, Loader2, AlertCircle, Camera, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface ProfileData {
  full_name: string;
  phone: string;
  nif: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

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
        const { error: authError } = await supabase.auth.updateUser({
          data: { full_name: formData.full_name, phone: formData.phone },
        });
        if (authError) throw authError;
      }

      setMessage({ type: "success", text: "Perfil atualizado com sucesso!" });
    } catch {
      setMessage({ type: "error", text: "Erro ao guardar as alterações." });
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
      setPasswordMessage({ type: "error", text: "As palavras-passe não coincidem." });
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
  const avatarUrl = profile?.avatar_url;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1
          className="text-2xl md:text-3xl font-bold text-accent mb-1"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          O Meu Perfil
        </h1>
        <p className="text-sm text-accent/40">Gerencie as suas informações pessoais</p>
      </motion.div>

      {/* Avatar + Email Card */}
      <motion.div variants={itemVariants} className="glass-card-immersive rounded-2xl p-6 mb-5 relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-orange-500/[0.06] to-transparent rounded-bl-full" />

        <div className="relative flex items-center gap-5">
          {/* Avatar with gradient ring */}
          <div className="relative group">
            <div className="absolute -inset-[3px] rounded-2xl bg-gradient-to-br from-orange-500/40 to-amber-500/20 opacity-70" />
            <div className="relative w-[72px] h-[72px] rounded-[14px] overflow-hidden bg-gradient-to-br from-orange-500/25 to-amber-600/10 flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt={formData.full_name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-orange-400">{initials}</span>
              )}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera size={13} className="text-white" />
            </button>
          </div>
          <div className="min-w-0">
            <p className="text-lg font-semibold text-accent">
              {formData.full_name || "Sem nome definido"}
            </p>
            <p className="text-sm text-accent/35 flex items-center gap-1.5 mt-0.5">
              <Mail size={13} />
              {email}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Profile form */}
      <motion.div variants={itemVariants} className="glass-card-immersive rounded-2xl p-6 mb-5">
        <div className="flex items-center gap-2 mb-6">
          <User size={15} className="text-accent/30" />
          <h2 className="text-xs font-semibold text-accent/40 uppercase tracking-widest">
            Dados pessoais
          </h2>
        </div>

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
              "mt-5 flex items-center gap-2 text-sm px-4 py-3 rounded-xl border",
              message.type === "success"
                ? "bg-green-500/10 text-green-400 border-green-500/15"
                : "bg-red-500/10 text-red-400 border-red-500/15"
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
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 disabled:opacity-50 text-white text-sm font-semibold rounded-full transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 hover:scale-[1.02]"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            Guardar Alterações
          </button>
        </div>
      </motion.div>

      {/* Security section */}
      <motion.div variants={itemVariants} className="glass-card-immersive rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Shield size={15} className="text-accent/30" />
            <h2 className="text-xs font-semibold text-accent/40 uppercase tracking-widest">
              Segurança
            </h2>
          </div>
          {!showPassword && (
            <button
              onClick={() => setShowPassword(true)}
              className="flex items-center gap-2 text-sm text-orange-400/60 hover:text-orange-400 transition-colors"
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
              placeholder="Mínimo 6 caracteres"
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
                    ? "bg-green-500/10 text-green-400 border-green-500/15"
                    : "bg-red-500/10 text-red-400 border-red-500/15"
                )}
              >
                {passwordMessage.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
                {passwordMessage.text}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-1">
              <button
                onClick={() => {
                  setShowPassword(false);
                  setNewPassword("");
                  setConfirmPassword("");
                  setPasswordMessage(null);
                }}
                className="px-5 py-2.5 text-sm text-accent/50 hover:text-accent border border-white/8 hover:border-white/15 rounded-full transition-all duration-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleChangePassword}
                disabled={passwordSaving}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 disabled:opacity-50 text-white text-sm font-semibold rounded-full transition-all duration-300 shadow-lg shadow-orange-500/20"
              >
                {passwordSaving ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                Alterar
              </button>
            </div>
          </motion.div>
        )}

        {!showPassword && (
          <p className="text-sm text-accent/25">
            Altere a sua palavra-passe para manter a sua conta segura.
          </p>
        )}
      </motion.div>
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
  return email ? email.slice(0, 2).toUpperCase() : "U";
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
    <label className="block group">
      <span className="text-[11px] text-accent/35 mb-1.5 block font-medium uppercase tracking-wider">{label}</span>
      <div className="relative">
        <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-accent/20 group-focus-within:text-orange-400/50 transition-colors" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full bg-white/[0.03] border border-white/[0.07] rounded-xl py-3 pl-10 pr-4 text-sm text-accent placeholder:text-accent/20",
            "focus:outline-none focus:border-orange-500/30 focus:bg-white/[0.05] focus:ring-1 focus:ring-orange-500/15 transition-all duration-300",
            disabled && "opacity-40 cursor-not-allowed"
          )}
        />
      </div>
    </label>
  );
}

function PerfilSkeleton() {
  return (
    <div className="space-y-5">
      <div>
        <div className="h-8 w-40 skeleton-shimmer rounded-lg mb-2" />
        <div className="h-4 w-64 skeleton-shimmer rounded-lg" />
      </div>
      <div className="glass-card-immersive rounded-2xl p-6 h-28 skeleton-shimmer" />
      <div className="glass-card-immersive rounded-2xl p-6 h-72 skeleton-shimmer" />
      <div className="glass-card-immersive rounded-2xl p-6 h-20 skeleton-shimmer" />
    </div>
  );
}
