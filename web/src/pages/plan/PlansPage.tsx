import React, { useContext, useEffect, useState } from "react";
import { NavItemsContext } from "../../components/utils/NavigatorComponent";

import { PlanListComponent } from "../../components/plans/plan";
import { CreatePlanModal } from "../../components/plans/CreatePlanModal";

// import "./PlansPage.scss";
import { LoadingStateContext } from "../../components/utils/Loading/LoadingModal";
import { getPlans, updatePlanItem } from "../../firebase/functions/plans";
import { goPlanDetail } from "../../constants/paths";

import "./PlansPage.scss";

export const PlansPage = () => {
  // const setLoadingState = useContext(LoadingStateContext)![1];
  // const [isDisplayCreateModal, setDisplayCreateModal] = useState(false);

  // const setNavItems = useContext(NavItemsContext)![1];
  // useEffect(() => {
  //   updatePlans();
  //   const navItems: NavItem[] = [];
  //   navItems.push({
  //     content: "go plan select(here)",
  //     navigate: PATHS.goPlans,
  //   });
  //   // setNavItems(navItems);
  // }, []);

  // const updatePlans = () => {
  //   setLoadingState({ activated: true, message: "now updating plan list" });
  //   PLANS.getPlans()
  //     .then((plans) => {
  //       setLoadingState({ activated: false });
  //       setPlans(plans);
  //       console.log(
  //         "plan list updated",
  //         plans.map((plan) => plan.title)
  //       );
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

  // const onCreatePlanButtonClicked = () => {
  //   setDisplayCreateModal((prev) => !prev);
  // };

  // const onModalClosed = () => {
  //   setDisplayCreateModal(false);
  //   updatePlans();
  // };
  const [plans, setPlans] = useState<Plan[]>([]);
  useEffect(() => {
    updatePlans();
  }, []);

  async function updatePlans() {
    const plans = await getPlans().catch((e) => {
      throw e;
    });

    setPlans(plans);
  }

  function handlePlanClicked(plan: Plan) {
    console.log("plan clicked");
    if (!plan.docId) {
      console.log("doc id is empty");
      return;
    }
    goPlanDetail(plan.docId);
  }

  return (
    <div id="plans-page">
      <h2 id="page-title">Choose your plans</h2>
      <div id="create-button-container">
        <label>...or create</label>
        <button className="text-button">NEW PLAN</button>
      </div>
      <PlanListComponent onClicked={handlePlanClicked} plans={plans} />
      {/* <CreatePlanModal visible={true} onClosed={onModalClosed} /> */}

      {/* <CreatePlanModal
        visible={isDisplayCreateModal}
        onClosed={onModalClosed}
      />
      <p className="title">Please choose your plan</p>
      <PlanListComponent onClicked={onPlanClicked} plans={plans} />
      <button onClick={onCreatePlanButtonClicked}>create plan</button> */}
    </div>
  );
};
