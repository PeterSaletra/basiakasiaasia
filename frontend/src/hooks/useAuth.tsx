import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "firebase/auth";
import {
  onAuthChange,
  loginWithEmail as fbLoginWithEmail,
  registerWithEmail as fbRegisterWithEmail,
  loginWithGoogle as fbLoginWithGoogle,
  logout as fbLogout,
  getIdToken,
} from "../services/firebaseAuth";
import { getUserRole, createUserProfile } from "../services/roleService";

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  role: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        setAccessToken(await getIdToken(firebaseUser));
        const r = await getUserRole(firebaseUser.uid);
        setRole(r);
      } else {
        setAccessToken(null);
        setRole(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string) => {
    const fbUser = await fbLoginWithEmail(email, password);
    setAccessToken(await getIdToken(fbUser));
    const r = await getUserRole(fbUser.uid);
    setRole(r);
    if (r === "admin") {
      navigate("/admin");
      return;
    }
    navigate("/forum");
  };

  const loginWithGoogle = async () => {
    const fbUser = await fbLoginWithGoogle();
    setAccessToken(await getIdToken(fbUser));
    let r = await getUserRole(fbUser.uid);
    if (!r) {
      await createUserProfile(
        fbUser.uid,
        fbUser.email ?? "",
        fbUser.displayName ?? fbUser.email?.split("@")[0] ?? "user"
      );
      r = "user";
    }
    setRole(r);
    if (r === "admin") {
      navigate("/admin");
      return;
    }
    navigate("/forum");
  };

  const register = async (email: string, password: string, username: string) => {
    const fbUser = await fbRegisterWithEmail(email, password);
    await createUserProfile(fbUser.uid, email, username, "user");
    setAccessToken(await getIdToken(fbUser));
    setRole("user");
    navigate("/forum");
  };

  const logout = async () => {
    await fbLogout();
    setUser(null);
    setAccessToken(null);
    setRole(null);
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      accessToken,
      role,
      isAuthenticated: !!user,
      loading,
      login,
      loginWithGoogle,
      register,
      logout,
    }),
    [user, accessToken, role, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
