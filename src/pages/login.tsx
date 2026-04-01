import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Substitua pelo caminho correto do seu logo
import logo from "../assets/vite.png";

import { db, auth } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

/* =========================================
   SCHEMAS DE VALIDAÇÃO (ZOD)
   ========================================= */

// Schema apenas para Login
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "O email é obrigatório")
    .email("Formato de email inválido"),
  password: z.string().min(1, "A senha é obrigatória"),
});

// Schema completo para o formulário gigante de Cadastro
const registerSchema = z
  .object({
    nomeCompleto: z.string().min(1, "O nome completo é obrigatório"),
    email: z
      .string()
      .min(1, "O email é obrigatório")
      .email("Formato de email inválido"),
    cpf: z
      .string()
      .min(1, "O CPF é obrigatório")
      .regex(
        /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
        "Formato de CPF inválido (000.000.000-00)",
      ),
    telefone: z.string().optional(),
    cep: z.string().optional(),
    endereco: z.string().optional(),
    numero: z.string().optional(),
    complemento: z.string().optional(),
    cidade: z.string().optional(),
    dataNascimento: z
      .string()
      .min(1, "A data de nascimento é obrigatória")
      .refine((date) => !isNaN(Date.parse(date)), "Data inválida"),
    password: z
      .string()
      .min(8, "Mínimo 8 dígitos")
      .regex(/[A-Z]/, "Pelo menos 1 letra maiúscula"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
    aceitouTermos: z.boolean().refine((val) => val === true, {
      message: "Você deve aceitar os termos",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

/* =========================================
   COMPONENTE PRINCIPAL
   ========================================= */
export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // 1. Instância do Hook Form para Login
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // 2. Instância do Hook Form para Cadastro
  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nomeCompleto: "",
      email: "",
      cpf: "",
      telefone: "",
      cep: "",
      endereco: "",
      numero: "",
      complemento: "",
      cidade: "",
      dataNascimento: "",
      password: "",
      confirmPassword: "",
      aceitouTermos: false,
    },
    mode: "onTouched",
  });

  // Handlers de submissão
  const onLoginSubmit = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      console.log("Usuário logado:", userCredential.user.uid);
      alert("Login efetuado com sucesso!");

      if (data.email === "admin-doctor@icloud.com") {
        navigate("/medical-area");
      } else {
        navigate("/define-objective");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        alert("Email ou senha incorretos.");
      } else {
        alert("Ocorreu um erro ao fazer login. Tente novamente.");
      }
    }
  };

  const onRegisterSubmit = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      const user = userCredential.user;

      const { password, confirmPassword, aceitouTermos, ...dadosDoUsuario } =
        data;

      await setDoc(doc(db, "users", user.uid), {
        ...dadosDoUsuario,
        uid: user.uid,
        createdAt: new Date().toISOString(),
        role: "paciente",
      });

      console.log("Conta criada com sucesso:", user.uid);
      alert("Conta criada com sucesso!");

      registerForm.reset();
      setIsLogin(true);
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      if (error.code === "auth/email-already-in-use") {
        registerForm.setError("email", {
          type: "manual",
          message: "Este email já está cadastrado.",
        });
      } else {
        alert(
          "Ocorreu um erro ao criar a conta. Verifique sua conexão e tente novamente.",
        );
      }
    }
  };

  const getInputClass = (hasError) => {
    return `w-full px-4 py-3 rounded-xl border transition-all text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#34C759] focus:border-transparent ${
      hasError ? "border-red-500" : "border-gray-300"
    }`;
  };

  const labelClass = "block text-sm font-medium text-gray-600 mb-1";
  const errorMsgClass = "text-xs text-red-500 mt-1 pl-1";

  return (
    <div className="min-h-screen bg-[#FDF9F3] flex flex-col items-center justify-center p-4 font-sans py-10">
      {/* Logo Section */}
      <div className="mb-8 flex flex-col items-center">
        <div className="w-32 h-32 rounded-full border border-gray-400 flex items-center justify-center mb-3 bg-white">
          <img
            className="w-16 h-16 rounded-md object-cover"
            src={logo}
            alt="Canna Consult Logo"
          />
        </div>
        <h2 className="text-xl font-bold tracking-widest text-gray-800 uppercase">
          Canna Consult
        </h2>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-[480px] bg-white rounded-[2rem] p-8 sm:p-10 shadow-sm border border-gray-100">
        {isLogin ? (
          /* FORMULÁRIO DE LOGIN */
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Bem vindo ao Canna Consult!
            </h1>
            <p className="text-center text-gray-500 text-sm mb-8">
              Faça login para continuar
            </p>

            <form
              onSubmit={loginForm.handleSubmit(onLoginSubmit)}
              className="space-y-5"
            >
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  placeholder="Digite seu email"
                  className={getInputClass(loginForm.formState.errors.email)}
                  {...loginForm.register("email")}
                />
                {loginForm.formState.errors.email && (
                  <p className={errorMsgClass}>
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Senha</label>
                <input
                  type="password"
                  placeholder="Digite sua senha"
                  className={getInputClass(loginForm.formState.errors.password)}
                  {...loginForm.register("password")}
                />
                {loginForm.formState.errors.password && (
                  <p className={errorMsgClass}>
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-xs font-semibold text-gray-700 hover:underline"
                >
                  Esqueceu sua senha?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-[#34C759] hover:bg-[#2eb34f] text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm mt-2"
              >
                Entrar
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Não tem uma conta?{" "}
                <button
                  onClick={() => {
                    setIsLogin(false);
                    loginForm.reset();
                  }}
                  className="font-bold text-gray-800 hover:underline bg-transparent border-none cursor-pointer"
                >
                  Cadastre-se
                </button>
              </p>
            </div>
          </div>
        ) : (
          /* FORMULÁRIO DE CADASTRO */
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Criar Conta
            </h1>
            <p className="text-center text-gray-500 text-sm mb-8">
              Preencha os dados abaixo para criar sua conta
            </p>

            <form
              onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
              className="space-y-4"
            >
              <div>
                <label className={labelClass}>Nome Completo *</label>
                <input
                  type="text"
                  placeholder="Digite seu nome completo"
                  className={getInputClass(
                    registerForm.formState.errors.nomeCompleto,
                  )}
                  {...registerForm.register("nomeCompleto")}
                />
                {registerForm.formState.errors.nomeCompleto && (
                  <p className={errorMsgClass}>
                    {registerForm.formState.errors.nomeCompleto.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Email *</label>
                <input
                  type="email"
                  placeholder="Digite seu email"
                  className={getInputClass(registerForm.formState.errors.email)}
                  {...registerForm.register("email")}
                />
                {registerForm.formState.errors.email && (
                  <p className={errorMsgClass}>
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>CPF *</label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  className={getInputClass(registerForm.formState.errors.cpf)}
                  {...registerForm.register("cpf")}
                />
                {registerForm.formState.errors.cpf && (
                  <p className={errorMsgClass}>
                    {registerForm.formState.errors.cpf.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Telefone</label>
                <input
                  type="text"
                  placeholder="(11) 99999-9999"
                  className={getInputClass(
                    registerForm.formState.errors.telefone,
                  )}
                  {...registerForm.register("telefone")}
                />
              </div>

              <div>
                <label className={labelClass}>CEP</label>
                <input
                  type="text"
                  placeholder="00000-000"
                  className={getInputClass(registerForm.formState.errors.cep)}
                  {...registerForm.register("cep")}
                />
              </div>

              <div>
                <label className={labelClass}>Endereço</label>
                <input
                  type="text"
                  placeholder="Rua, avenida, etc"
                  className={getInputClass(
                    registerForm.formState.errors.endereco,
                  )}
                  {...registerForm.register("endereco")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Número</label>
                  <input
                    type="text"
                    placeholder="123"
                    className={getInputClass(
                      registerForm.formState.errors.numero,
                    )}
                    {...registerForm.register("numero")}
                  />
                </div>
                <div>
                  <label className={labelClass}>Complemento</label>
                  <input
                    type="text"
                    placeholder="Apto 101, Bloco"
                    className={getInputClass(
                      registerForm.formState.errors.complemento,
                    )}
                    {...registerForm.register("complemento")}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Cidade</label>
                <input
                  type="text"
                  placeholder="Nome da cidade"
                  className={getInputClass(
                    registerForm.formState.errors.cidade,
                  )}
                  {...registerForm.register("cidade")}
                />
              </div>

              <div>
                <label className={labelClass}>Data de Nascimento *</label>
                <input
                  type="date"
                  className={getInputClass(
                    registerForm.formState.errors.dataNascimento,
                  )}
                  {...registerForm.register("dataNascimento")}
                />
                {registerForm.formState.errors.dataNascimento && (
                  <p className={errorMsgClass}>
                    {registerForm.formState.errors.dataNascimento.message}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Senha *</label>
                <input
                  type="password"
                  placeholder="Digite sua senha"
                  className={getInputClass(
                    registerForm.formState.errors.password,
                  )}
                  {...registerForm.register("password")}
                />
                {registerForm.formState.errors.password ? (
                  <p className={errorMsgClass}>
                    {registerForm.formState.errors.password.message}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1 pl-1">
                    Mínimo 8 dígitos e 1 letra maiúscula
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Confirmar Senha *</label>
                <input
                  type="password"
                  placeholder="Confirme sua senha"
                  className={getInputClass(
                    registerForm.formState.errors.confirmPassword,
                  )}
                  {...registerForm.register("confirmPassword")}
                />
                {registerForm.formState.errors.confirmPassword && (
                  <p className={errorMsgClass}>
                    {registerForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col mt-2 mb-4">
                <div className="flex items-center ">
                  <input
                    type="checkbox"
                    id="aceitouTermos"
                    className="w-4 h-4 text-[#34C759] border-gray-300 rounded focus:ring-[#34C759]"
                    {...registerForm.register("aceitouTermos")}
                  />
                  <label
                    htmlFor="aceitouTermos"
                    className="ml-2 text-sm text-gray-600"
                  >
                    Aceito os Termos e Condições
                  </label>
                </div>
                {registerForm.formState.errors.aceitouTermos && (
                  <p className={errorMsgClass}>
                    {registerForm.formState.errors.aceitouTermos.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className={`w-full bg-[#34C759] hover:bg-[#28A745] text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm mt-4 ${
                  registerForm.formState.isSubmitting
                    ? "opacity-70 cursor-not-allowed"
                    : ""
                }`}
                disabled={registerForm.formState.isSubmitting}
              >
                {registerForm.formState.isSubmitting
                  ? "Enviando..."
                  : "Criar Conta"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setIsLogin(true);
                  registerForm.reset();
                }}
                className="text-sm font-bold text-gray-800 hover:underline bg-transparent border-none cursor-pointer"
              >
                Já possui conta? Faça login
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Links */}
      <div className="mt-10 flex flex-col items-center space-y-4 pb-8">
        <div className="flex space-x-6">
          {["Sobre Nós", "Contato", "Política de Privacidade"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm text-gray-600 hover:underline"
            >
              {link}
            </a>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          &copy; 2024 Canna Consult. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
