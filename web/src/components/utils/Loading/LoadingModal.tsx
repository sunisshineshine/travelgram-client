import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

import "./LoadingModal.scss";

interface LoadingState {
  activated: boolean | "blur";
  icon?: "auth" | "place" | "travel";
  message?: string;
}

export const SetLoadingContext = createContext<
  Dispatch<SetStateAction<LoadingState>> | undefined
>(undefined);

export const LoadingStateContext = createContext<LoadingState | undefined>(
  undefined
);
// export const LoadingStateContext = createContext<
//   [LoadingPageProps, Dispatch<SetStateAction<LoadingPageProps>>] | undefined
// >(undefined);

export const LoadingContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    activated: false,
    message: "loading page",
  });

  return (
    <LoadingStateContext.Provider value={loadingState}>
      <SetLoadingContext.Provider value={setLoadingState}>
        {props.children}
      </SetLoadingContext.Provider>
    </LoadingStateContext.Provider>
  );
};

export function LoadingModalComponent() {
  const loadingState = useContext(LoadingStateContext)!;
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
      {loadingState.activated != "blur" && (
        <div className="content">
          <p className="icon">{getIcon()}</p>
          <p>{loadingState.message}</p>
          <p>🧳 YOGURTRAVEL</p>
        </div>
      )}
    </div>
  );
}
