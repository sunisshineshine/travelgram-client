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

export const PlanItemComponent = (props: { planItem: PlanItem }) => {
  console.log(props);
  console.log("plan item componenet rendered");
  // const [planItem, setPlanItem] = useState<PlanItem | null>(null);

  return <div>{props.planItem.title}</div>;
};
