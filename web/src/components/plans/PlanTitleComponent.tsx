import React from "react";

export const PlanTitleComponent = (props: { title: string }) => {
  return (
    <div className="plan-title-component">
      <h1>{props.title}</h1>
    </div>
  );
};
