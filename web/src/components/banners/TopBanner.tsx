import React from "react";
import { LoginStateComponent } from "../auth/LoginStateComponent";
import "./TopBanner.css";

export const TopBanner = () => {
  return (
    <div className="top-banner">
      <h1 className="title">Yogurtravel</h1>
      <LoginStateComponent />
    </div>
  );
};
