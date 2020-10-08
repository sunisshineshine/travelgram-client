import React, { useContext, useEffect, useState } from "react";
import { NavItemsContext } from "../../components/utils/Navigation";

import { PlanListComponent } from "../../components/plans/plan";
import * as PLANS from "../../firebase/functions/plans";
import * as PATHS from "../../constants/paths";
import { CreatePlanModal } from "../../components/plans/CreatePlanModal";

import "./PlansPage.scss";
import { LoadingStateContext } from "../../components/utils/Loading/LoadingModal";

export const PlansPage = () => {
  const setLoadingState = useContext(LoadingStateContext)![1];
  const [plans, setPlans] = useState<Plan[]>([]);
  const [modalVisible, setVisible] = useState(false);
  console.log(modalVisible);
  const setNavItems = useContext(NavItemsContext)![1];
  useEffect(() => {
    updatePlans();
    const navItems: NavItem[] = [];
    navItems.push({
      content: "go plan select(here)",
      navigate: PATHS.goPlans,
    });
    setNavItems(navItems);
  }, []);

  const updatePlans = () => {
    setLoadingState({ activated: true, message: "now updating plan list" });
    PLANS.getPlans()
      .then((plans) => {
        setLoadingState({ activated: false });
        setPlans(plans);
        console.log("plan has updated");
        console.log(plans.map((plan) => plan.title));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onCreatePlanButtonClicked = () => {
    setVisible((prev) => !prev);
  };

  const onPlanClicked = (plan: Plan) => {
    console.log("plan clicked");
    if (!plan.docId) {
      console.log("doc id is empty");
      return;
    }
    PATHS.goPlanDetail(plan.docId);
  };

  const onModalClosed = () => {
    setVisible(false);
    updatePlans();
  };

  return (
    <div className="plans-page">
      {/* <CreatePlanModal visible={true} onClosed={onModalClosed} /> */}

      <CreatePlanModal visible={modalVisible} onClosed={onModalClosed} />
      <p className="title">Please choose your plan</p>
      <PlanListComponent onClicked={onPlanClicked} plans={plans} />
      <button onClick={onCreatePlanButtonClicked}>create plan</button>
    </div>
  );
};
