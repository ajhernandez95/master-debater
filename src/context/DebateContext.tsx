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
}

export const DebateContext = createContext(null as unknown as IDebateContext);

export const DebateContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [debateStep, setDebateStep] = useState(0);
  const [debate, setDebate] = useState({});

  return (
    <DebateContext.Provider
      value={{
        debateStep,
        setDebateStep,
        debate,
        setDebate,
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
