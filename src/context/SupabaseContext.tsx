import { Session, SupabaseClient, User } from "@supabase/supabase-js";
import {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { supabase as supabaseClient } from "../utils/supabase";
import axios from "axios";

interface ISupabaseContext {
  isLoading: boolean;
  isLoggedIn: boolean | null;
  user: User | null;
  session: Session | null;
  tier: string | null;
  setTier: Dispatch<SetStateAction<string | null>>;
  supabase: SupabaseClient;
}

export const SupabaseContext = createContext(
  null as unknown as ISupabaseContext
);

export const SupabaseContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [tier, setTier] = useState<string | null>("free");
  const [supabase] = useState<SupabaseClient>(supabaseClient);

  useEffect(() => {
    // Handles initial check if user is logged in
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log(session);
      if (!session) {
        setSession(null);
        setUser(null);
        setIsLoggedIn(false);
      } else {
        setSession(session);
        setUser(session?.user || null);
        setIsLoggedIn(true);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${session?.access_token}`;
      }
      setIsLoading(false);
    });

    // Subscribes to auth changes to update logged in state
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user || null);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${session?.access_token}`;
        if (event === "SIGNED_IN" && !isLoggedIn) {
          setIsLoggedIn(true);
        } else if (event === "SIGNED_OUT") {
          setIsLoggedIn(false);
        }
      }
    );

    // Clean up the listener when the component unmounts
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <SupabaseContext.Provider
      value={{ isLoading, isLoggedIn, user, session, tier, setTier, supabase }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within an AuthProvider");
  }
  return context;
};
