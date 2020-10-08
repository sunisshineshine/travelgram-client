import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import "./LoadingModal.scss";

interface LoadingPageProps {
  activated: boolean;
  icon?: "auth" | "place" | "travel";
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

  return (
    <LoadingStateContext.Provider value={[loadingState, setLoadingState]}>
      {props.children}
    </LoadingStateContext.Provider>
  );
};

export const LoadingModalComponent = () => {
  const loadingState = useContext(LoadingStateContext)![0];
  const getIcon = (): string | undefined => {
    switch (loadingState.icon) {
      case "auth":
        return "🔒";
      case "place":
        return "🗺️";
      case "travel":
        return "✈️";
      default:
        return undefined;
    }
  };

  return (
    <div
      id="loading-modal-component"
      style={{ display: loadingState.activated ? "block" : "none" }}
    >
      <div className="content">
        <p className="icon">{getIcon()}</p>
        <p>{loadingState.message}</p>
        <p>🧳 YOGURTRAVEL</p>
      </div>
    </div>
  );
};
