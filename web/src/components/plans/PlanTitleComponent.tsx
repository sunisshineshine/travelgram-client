import React from "react";

export const PlanTitleComponent = (props: { plan: Plan }) => {
  const { plan } = props;
  return (
    <div className="plan-title-component">
      <h1>{plan.title}</h1>
    </div>
  );
};
