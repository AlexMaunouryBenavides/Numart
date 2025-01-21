import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);

  // Sign up fonction

  const signUpNewUser = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) {
      console.log("There was a problem signin up", error);
      return { success: false, error };
    }
    return { success: true, data };
  };

  // Sign in function

  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        console.error("sing in error occured : ", error);
        return { success: false, error: error.message };
      }
      console.log("sing in success");
      return { success: true, data };
    } catch (error) {
      console.error("an error occured", error);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // Signout Function

  const signOut = () => {
    const { error } = supabase.auth.signOut();
    if (error) {
      console.log("There was an error");
    }
  };

  return <AuthContext.Provider value={{ session, signUpNewUser, signOut, signUpNewUser, signInUser }}>{children}</AuthContext.Provider>;
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
