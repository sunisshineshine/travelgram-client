import React from "react";

export const PlanComponent = (props: {
  plan: Plan;
  onClick: (plan: Plan) => void;
}) => {
  const { plan } = props;
  return (
    <div
      className="plan-component"
      onClick={() => {
        props.onClick(plan);
      }}
    >
      {plan.title}
    </div>
  );
};
