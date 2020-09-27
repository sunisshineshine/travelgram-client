import React from "react";
import "./LoadingModal.css";

export const LoadingModal = (props: { loading: Boolean }) => {
  const { loading } = props;

  return (
    <div
      className="loading-modal"
      style={{ display: loading ? "block" : "none" }}
    >
      <div className="content">
        <h1>Loading...</h1>
        <h2>yogurtravel by jiny suny</h2>
      </div>
    </div>
  );
};
