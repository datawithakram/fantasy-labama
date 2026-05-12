import { createContext, useContext, useState } from "react";

export type ISaveState = "gameweekFirst" | "initial" | null;
interface ISaveContext {
  saveState: ISaveState;
  setSaveState: (value: ISaveState) => void;
}

const SaveContext = createContext<ISaveContext | null>(null);

export default SaveContext;

interface ISaveProviderProps {
  children: React.ReactNode;
}

export const SaveProvider: React.FC<ISaveProviderProps> = ({ children }) => {
  const [saveState, setSaveState] = useState<ISaveState>(null);

  return (
    <SaveContext.Provider
      value={{
        saveState,
        setSaveState,
      }}
    >
      {children}
    </SaveContext.Provider>
  );
};

export const useSaveContext = () => {
  const context = useContext(SaveContext);
  if (!context) {
    throw new Error("useSaveContext must be used within a SaveProvider");
  }
  return context;
};
