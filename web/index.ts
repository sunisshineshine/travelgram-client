import "./index.css";
import { getPlaceAutocompletions } from "./firebase/functions";

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

// about place search
const $input = document.getElementById("input") as HTMLInputElement;
const $suggestList = document.getElementById(
  "search-place-suggest"
) as HTMLElement;

let suggestList: google.maps.places.AutocompletePrediction[] = [];

const updateSuggestList = () => {
  // create string list of main text of suggestion
  const suggests = suggestList.map(
    (prediction) => prediction.structured_formatting.main_text
  );

  $suggestList.innerHTML = "";
  suggests.map((suggest) => {
    const $suggest = document.createElement("p");
    $suggest.innerHTML = suggest;
    $suggestList.appendChild($suggest);
  });
};

const updateSuggetionSelect = (position: number) => {
  $suggestList.querySelectorAll("p").forEach(($suggest) => {
    $suggest.className = "";
  });
  if (position == -1) {
    return;
  }

  const $selectedSuggest = $suggestList.children.item(position);

  if ($selectedSuggest) {
    $selectedSuggest.className = "active";
  }
};

let prevInputLength = 0;
let selectedSuggestPosition = -1;

$input.addEventListener("keyup", (e: KeyboardEvent) => {
  const input = $input.value;
  const currentInputLength = input.length;

  const suggestListLastIndex = $suggestList.childNodes.length;

  // submit place
  if (e.key == "Enter") {
    if (
      selectedSuggestPosition > -1 &&
      selectedSuggestPosition < suggestListLastIndex
    ) {
      planList.push(
        suggestList[selectedSuggestPosition].structured_formatting.main_text
      );
    } else {
      if (suggestList.length > 0) {
        planList.push(suggestList[0].structured_formatting.main_text);
      } else {
        // if there are no matched place, nothing happened
        return;
      }
    }

    // clear the suggest list and input
    suggestList = [];
    updateSuggestList();
    $input.value = "";

    updatePlanList();
  }

  // select suggestion below
  if (e.key == "ArrowDown") {
    if (selectedSuggestPosition <= suggestListLastIndex) {
      selectedSuggestPosition += 1;
    }

    updateSuggetionSelect(selectedSuggestPosition);
    return;
  }

  // select suggestion up
  if (e.key == "ArrowUp") {
    if (selectedSuggestPosition >= -1) {
      selectedSuggestPosition += -1;
    }

    updateSuggetionSelect(selectedSuggestPosition);
    return;
  }

  if (prevInputLength <= currentInputLength) {
    scheduledQuery = input;
    if (!checkLimitForAutocompletion()) {
      return;
    }

    querySuggestion(input);
  }

  prevInputLength = currentInputLength;
});

let lastQueriedInput = "";
const querySuggestion = (input: string) => {
  if (input == lastQueriedInput) {
    return;
  }
  console.log("query suggestion with " + input);

  selectedSuggestPosition = -1;
  updateSuggetionSelect(selectedSuggestPosition);

  lastQueriedInput = input;
  getPlaceAutocompletions(input)
    .then((result) => {
      if (result == null) {
        return;
      }
      suggestList = result;
      updateSuggestList();
    })
    .catch((reason) => {
      console.log(reason);
    });
};

let nowLoading = false;
let scheduledQuery: string | null = null;
const checkLimitForAutocompletion = (): boolean => {
  if (nowLoading == false) {
    nowLoading = true;
    setTimeout(() => {
      nowLoading = false;
      if (scheduledQuery != null) {
        querySuggestion(scheduledQuery);
        scheduledQuery = null;
      }
    }, 500);
    return true;
  } else {
    return false;
  }
};
