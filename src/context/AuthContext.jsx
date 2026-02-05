import React, { createContext, useContext, useState, useEffect } from "react";
import { createSymptomsAPI, getAllCasesAPI } from "../services/allAPI";
import { getAuthHeader } from "../utils/authHeader";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [role, setRole] = useState("");
  const [authorisedUSer, setAuthorisedUser] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [cases, setCases] = useState([]);

  // console.log(cases);

  useEffect(() => {
    // Check for existing session
    const token = sessionStorage.getItem("token");
    const storedUser = sessionStorage.getItem("user");
    if (token && storedUser) {
      console.log("Logging in first time!");
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setRole(parsed.role || "");
      setAuthorisedUser(true);
    } else {
      setUser(null);
      setRole("");
      setAuthorisedUser(false);
    }

    if (!user?._id) return;
    getUserCases();
    setIsLoading(false);
  }, [user?._id]);

  const logout = () => {
    setUser(null);
    setCases([]);
    sessionStorage.removeItem("user");
    sessionStorage.clear();
  };

  const submitSymptoms = async (symptomData) => {

    const headers = getAuthHeader();

    try {
      const res = await createSymptomsAPI(symptomData, headers);
      if (res?.status == 200) {
        getUserCases();
      } else {
        console.log("Error Creating Symptoms.", res);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getUserCases = async () => {

    if (!user) return [];
    const headers = getAuthHeader();
    
    try{
      const res = await getAllCasesAPI(headers)
      if (res?.status == 200) {
        setCases(res.data);
      } else {
        console.log("Error Fetching User cases.", res);
      }
    }catch (err) {
      console.log(err);
    }
    return cases.filter((c) => c.userId == user._id);
  };

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated: !!user,
    logout,
    submitSymptoms,
    cases,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
