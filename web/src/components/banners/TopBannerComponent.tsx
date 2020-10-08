import React from "react";
import { LoginStateComponent } from "../auth/LoginStateComponent";
import "./TopBannerComponent.scss";

export const TopBannerComponent = () => {
  return (
    <div id="top-banner-component" className="flex-coloumn">
      <h1 id="title">YOGURTRAVEL</h1>
      <LoginStateComponent />
    </div>
  );
};
