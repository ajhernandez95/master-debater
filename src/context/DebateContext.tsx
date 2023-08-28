import {
  createContext,
  useState,
  ReactNode,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";

interface IDebateContext {
  debateStep: number;
  setDebateStep: Dispatch<SetStateAction<number>>;
  debate: any;
  setDebate: Dispatch<SetStateAction<any>>;
  loadingDebate: boolean;
  setLoadingDebate: Dispatch<SetStateAction<boolean>>;
}

export const DebateContext = createContext(null as unknown as IDebateContext);

export const DebateContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [debateStep, setDebateStep] = useState(0);
  const [debate, setDebate] = useState({});
  const [loadingDebate, setLoadingDebate] = useState(false);

  return (
    <DebateContext.Provider
      value={{
        debateStep,
        setDebateStep,
        debate,
        setDebate,
        loadingDebate,
        setLoadingDebate,
      }}
    >
      {children}
    </DebateContext.Provider>
  );
};

export const useDebate = () => {
  const context = useContext(DebateContext);
  if (!context) {
    throw new Error("useDebate must be used within an DebateProvider");
  }
  return context;
};
