import React, { createContext, useContext } from "react";

interface ThemeContextType {
  theme: "light";
  toggleTheme: () => void;
  isDark: false;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={{ theme: "light", toggleTheme: () => {}, isDark: false }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
