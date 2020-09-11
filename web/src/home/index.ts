import "./index.css";

import "./SearchPlace";

const $planList = document.getElementById("plan-list") as HTMLElement;
let planList: string[] = [];

const updatePlanList = () => {
  $planList.innerHTML = "";
  planList.map((plan) => {
    const $plan = document.createElement("p");
    $plan.innerHTML = plan;
    $planList.appendChild($plan);
  });
};

export const addPlanItem = (
  place: google.maps.places.AutocompletePrediction
) => {
  planList.push(place.structured_formatting.main_text);
  updatePlanList();
};
