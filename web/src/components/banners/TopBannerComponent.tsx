import React from "react";
import { UserStateComponent } from "../auth/UserStateComponent";
import "./TopBannerComponent.scss";

export const TopBannerComponent = () => {
  return (
    <div id="top-banner-component" className="flex-coloumn">
      <h1 id="title">YOGURTRAVEL</h1>
      <UserStateComponent />
    </div>
  );
};
