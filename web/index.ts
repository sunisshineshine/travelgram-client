import { getPlaceAutocompletions } from "./firebase/functions";

const $input = document.getElementById("input") as HTMLInputElement;

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

let prevInputLength = 0;

$input.addEventListener("keydown", (e: KeyboardEvent) => {
  const input = $input.value;
  const currentInputLength = input.length;

  if (prevInputLength <= currentInputLength) {
    console.log(input);
    getPlaceAutocompletions(input)
      .then((result) => {
        if (result == null) {
          return;
        }
        const placeNameList: string[] = result.map((prediction) => {
          return prediction.structured_formatting.main_text;
        });
        planList = placeNameList;
        updatePlanList();
      })
      .catch((reason) => {
        console.log(reason);
      });
  }
  prevInputLength = currentInputLength;
});
