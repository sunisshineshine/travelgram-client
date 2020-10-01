import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import "./LoadingModal.css";

interface LoadingPageProps {
  activated: boolean;
  message?: string;
}

export const LoadingStateContext = createContext<
  [LoadingPageProps, Dispatch<SetStateAction<LoadingPageProps>>] | undefined
>(undefined);

export const LoadingContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const [loadingState, setLoadingState] = useState<LoadingPageProps>({
    activated: false,
    message: "loading page",
  });

  const TempComponent = () => {
    console.log("loading state initiated");
    return <div>hello</div>;
  };

  return (
    <LoadingStateContext.Provider value={[loadingState, setLoadingState]}>
      <TempComponent />
      {props.children}
    </LoadingStateContext.Provider>
  );
};

export const LoadingModal = () => {
  const loadingState = useContext(LoadingStateContext)![0];

  return (
    <div
      className="loading-modal"
      style={{ display: loadingState.activated ? "block" : "none" }}
    >
      <div className="content">
        <h1>{loadingState.message}</h1>
        <h2>yogurtravel by jiny suny</h2>
      </div>
    </div>
  );
};
