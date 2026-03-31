"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Loader2, AlertCircle, CheckCircle, ChevronDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

// ─── Google Icon SVG ────────────────────────────────────────────────────────

function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// ─── Schemas ─────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().min(1, "O email é obrigatório").email("Email inválido"),
  password: z.string().min(1, "A password é obrigatória"),
});

const registerSchema = z
  .object({
    fullName: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
    email: z.string().min(1, "O email é obrigatório").email("Email inválido"),
    password: z
      .string()
      .min(8, "Mínimo de 8 caracteres")
      .regex(/[A-Z]/, "Deve conter uma letra maiúscula")
      .regex(/[0-9]/, "Deve conter um número"),
    confirmPassword: z.string().min(1, "Confirme a password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As passwords não coincidem",
    path: ["confirmPassword"],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;
type Tab = "login" | "register";
interface ToastMessage { type: "error" | "success"; text: string; }
interface AuthModalProps { isOpen: boolean; onClose: () => void; }

// ─── Sub-components ───────────────────────────────────────────────────────────

function Toast({ message }: { message: ToastMessage }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
        message.type === "error"
          ? "bg-red-500/10 border border-red-500/20 text-red-400"
          : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
      }`}
    >
      {message.type === "error" ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
      {message.text}
    </motion.div>
  );
}

function InputField({
  id, label, type = "text", error, registration, showToggle, onToggle, isVisible,
}: {
  id: string; label: string; type?: string; error?: string;
  registration: Record<string, unknown>;
  showToggle?: boolean; onToggle?: () => void; isVisible?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-white/60">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showToggle && isVisible ? "text" : type}
          autoComplete={type === "password" ? "current-password" : id}
          className={`w-full px-4 py-3 rounded-xl bg-white/[0.06] border transition-all duration-200 text-white placeholder-white/30 focus:outline-none focus:ring-2 ${
            error
              ? "border-red-500/50 focus:ring-red-500/30"
              : "border-white/10 focus:border-orange-500/50 focus:ring-orange-500/20"
          }`}
          {...registration}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
            tabIndex={-1}
          >
            {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-red-400 flex items-center gap-1"
          >
            <AlertCircle size={12} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("login");
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  /** Show email/password form collapsed by default — OAuth is the primary path */
  const [showEmailForm, setShowEmailForm] = useState(false);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  });

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on ESC
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );
  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setToast(null);
      setShowPassword(false);
      setShowConfirmPassword(false);
      setIsSubmitting(false);
      setOauthLoading(false);
      setShowEmailForm(false);
      loginForm.reset();
      registerForm.reset();
    }
  }, [isOpen, loginForm, registerForm]);

  // Reset toast on tab switch
  useEffect(() => {
    setToast(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setShowEmailForm(false);
  }, [activeTab]);

  // ─── OAuth ────────────────────────────────────────────────────────────────

  const handleGoogleOAuth = async () => {
    setOauthLoading(true);
    setToast(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });
      if (error) {
        setToast({ type: "error", text: "Erro ao iniciar sessão com Google. Tente o email." });
        setShowEmailForm(true);
      }
    } catch {
      setToast({ type: "error", text: "Erro de ligação. Tente novamente." });
    } finally {
      setOauthLoading(false);
    }
  };

  // ─── Email/Password ────────────────────────────────────────────────────────

  const handleLogin = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setToast(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) {
        const messages: Record<string, string> = {
          "Invalid login credentials": "Email ou password incorretos.",
          "Email not confirmed": "Confirme o seu email antes de entrar.",
          "Too many requests": "Demasiadas tentativas. Aguarde um momento.",
        };
        setToast({ type: "error", text: messages[error.message] ?? "Erro ao iniciar sessão." });
        return;
      }
      setToast({ type: "success", text: "Sessão iniciada com sucesso!" });
      setTimeout(() => { onClose(); window.location.reload(); }, 600);
    } catch {
      setToast({ type: "error", text: "Erro de ligação. Verifique a sua internet." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setToast(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: { data: { full_name: data.fullName } },
      });
      if (error) {
        const messages: Record<string, string> = {
          "User already registered": "Este email já está registado. Tente iniciar sessão.",
          "Password should be at least 6 characters": "A password deve ter pelo menos 6 caracteres.",
          "Too many requests": "Demasiadas tentativas. Aguarde um momento.",
        };
        setToast({ type: "error", text: messages[error.message] ?? "Erro ao criar conta. Tente novamente." });
        return;
      }
      setToast({
        type: "success",
        text: "Conta criada! Verifique o seu email para confirmar o registo.",
      });
      registerForm.reset();
    } catch {
      setToast({ type: "error", text: "Erro de ligação. Verifique a sua internet." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.03] backdrop-blur-2xl border border-white/[0.12] shadow-2xl shadow-black/40">
              {/* Top accent line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-xl hover:bg-white/10 transition-colors text-white/50 hover:text-white/90"
              >
                <X size={20} />
              </button>

              <div className="p-8">
                {/* Header */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                    {activeTab === "login" ? "Bem-vindo de volta" : "Criar conta"}
                  </h2>
                  <p className="text-sm text-white/50 mt-1">
                    {activeTab === "login" ? "Aceda à sua conta VoltStock" : "Junte-se à comunidade VoltStock"}
                  </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-1 rounded-xl bg-white/[0.05] mb-6">
                  {(["login", "register"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`relative flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                        activeTab === tab ? "text-white" : "text-white/40 hover:text-white/60"
                      }`}
                    >
                      {activeTab === tab && (
                        <motion.div
                          layoutId="auth-tab-indicator"
                          className="absolute inset-0 bg-white/10 rounded-lg border border-white/[0.08]"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">
                        {tab === "login" ? "Entrar" : "Criar Conta"}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Toast */}
                <AnimatePresence mode="wait">
                  {toast && (
                    <div className="mb-4">
                      <Toast message={toast} />
                    </div>
                  )}
                </AnimatePresence>

                {/* ── Google OAuth — primary CTA ── */}
                <button
                  onClick={handleGoogleOAuth}
                  disabled={oauthLoading || isSubmitting}
                  className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white hover:bg-white/90 text-gray-800 font-semibold text-sm shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  {oauthLoading ? (
                    <Loader2 size={20} className="animate-spin text-gray-500" />
                  ) : (
                    <GoogleIcon size={20} />
                  )}
                  {oauthLoading
                    ? "A redirecionar…"
                    : activeTab === "login"
                    ? "Continuar com Google"
                    : "Registar com Google"}
                </button>

                {/* ── Divider ── */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-white/[0.08]" />
                  <button
                    onClick={() => setShowEmailForm((v) => !v)}
                    className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors whitespace-nowrap"
                  >
                    ou continuar com email
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${showEmailForm ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div className="flex-1 h-px bg-white/[0.08]" />
                </div>

                {/* ── Email/Password Forms (collapsible) ── */}
                <AnimatePresence>
                  {showEmailForm && (
                    <motion.div
                      key="email-forms"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <AnimatePresence mode="wait">
                        {/* Login Form */}
                        {activeTab === "login" && (
                          <motion.form
                            key="login"
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 16 }}
                            transition={{ duration: 0.2 }}
                            onSubmit={loginForm.handleSubmit(handleLogin)}
                            className="space-y-4"
                            noValidate
                          >
                            <InputField
                              id="login-email"
                              label="Email"
                              type="email"
                              registration={loginForm.register("email")}
                              error={loginForm.formState.errors.email?.message}
                            />
                            <InputField
                              id="login-password"
                              label="Password"
                              type="password"
                              registration={loginForm.register("password")}
                              error={loginForm.formState.errors.password?.message}
                              showToggle
                              onToggle={() => setShowPassword((p) => !p)}
                              isVisible={showPassword}
                            />
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white shadow-lg shadow-orange-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                              {isSubmitting ? <><Loader2 size={18} className="animate-spin" />A entrar…</> : "Entrar"}
                            </button>
                          </motion.form>
                        )}

                        {/* Register Form */}
                        {activeTab === "register" && (
                          <motion.form
                            key="register"
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -16 }}
                            transition={{ duration: 0.2 }}
                            onSubmit={registerForm.handleSubmit(handleRegister)}
                            className="space-y-4"
                            noValidate
                          >
                            <InputField
                              id="register-name"
                              label="Nome completo"
                              registration={registerForm.register("fullName")}
                              error={registerForm.formState.errors.fullName?.message}
                            />
                            <InputField
                              id="register-email"
                              label="Email"
                              type="email"
                              registration={registerForm.register("email")}
                              error={registerForm.formState.errors.email?.message}
                            />
                            <InputField
                              id="register-password"
                              label="Password"
                              type="password"
                              registration={registerForm.register("password")}
                              error={registerForm.formState.errors.password?.message}
                              showToggle
                              onToggle={() => setShowPassword((p) => !p)}
                              isVisible={showPassword}
                            />
                            <InputField
                              id="register-confirm-password"
                              label="Confirmar password"
                              type="password"
                              registration={registerForm.register("confirmPassword")}
                              error={registerForm.formState.errors.confirmPassword?.message}
                              showToggle
                              onToggle={() => setShowConfirmPassword((p) => !p)}
                              isVisible={showConfirmPassword}
                            />
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white shadow-lg shadow-orange-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                              {isSubmitting ? <><Loader2 size={18} className="animate-spin" />A criar…</> : "Criar Conta"}
                            </button>
                          </motion.form>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Footer */}
                <p className="text-center text-xs text-white/30 mt-6">
                  Ao continuar, aceita os nossos{" "}
                  <a href="/termos" onClick={onClose} className="text-white/50 hover:text-white/70 transition-colors">
                    Termos de Serviço
                  </a>{" "}
                  e{" "}
                  <a href="/privacidade" onClick={onClose} className="text-white/50 hover:text-white/70 transition-colors">
                    Política de Privacidade
                  </a>
                  .
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
