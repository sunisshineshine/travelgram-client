import { getPlaceAutocompletions } from "../firebase/functions";

import { addPlanItem } from "./index";

const $input = document.getElementById("input") as HTMLInputElement;

$input.addEventListener("keyup", (e: KeyboardEvent) => {
  const input = $input.value;

  switch (e.key) {
    case "Enter":
      submitPlace();
      return;

    case "ArrowDown":
      selectPrediction("down");
      return;

    case "ArrowUp":
      selectPrediction("up");
      return;

    default:
      getPredictions(input);
      return;
  }
});

const submitPlace = () => {
  if (selectedPredictionPosition == -1) {
    selectedPredictionPosition = 0;
  }
  const selectedPrediction = predictionList[selectedPredictionPosition];
  if (selectedPrediction != null) {
    addPlanItem(selectedPrediction);
    clearPredictions();
    $input.value = "";
  }
};

// about prediction
let predictionList: google.maps.places.AutocompletePrediction[] = [];
let lastQueried = "";
const $predictionList = document.getElementById(
  "search-place-suggest"
) as HTMLElement;

let scheduledQuery = "";
const getPredictions = (query: string) => {
  if (query == "") {
    clearPredictions();
  }

  // optimization for searching query
  // user will waiting for 0.5s, query will be searched
  scheduledQuery = query;
  setTimeout(() => {
    if (
      scheduledQuery == query &&
      scheduledQuery != "" &&
      lastQueried != query
    ) {
      console.log(`get autocompletion with ${query}`);
      lastQueried = query;
      getPlaceAutocompletions(query)
        .then((predictions) => {
          predictionList = predictions;
          updatePredictionListDocument();
        })
        .catch((reason) => {
          console.log(reason);
        });
    }
  }, 500);
};

const updatePredictionListDocument = () => {
  // clear document item
  $predictionList.innerHTML = "";

  predictionList.map((prediction, index) => {
    const $prediction = document.createElement("p");
    $prediction.innerHTML =
      prediction.structured_formatting.main_text + prediction.description;
    if (index == selectedPredictionPosition) {
      $prediction.className = "active";
    }
    $prediction.addEventListener("click", () => {
      selectedPredictionPosition = index;
      submitPlace();
    });
    $predictionList.appendChild($prediction);
  });
};

let selectedPredictionPosition = -1;
const selectPrediction = (direction: "down" | "up" | "clear") => {
  if (direction == "down") {
    selectedPredictionPosition += 1;
    if (selectedPredictionPosition >= predictionList.length) {
      selectedPredictionPosition = predictionList.length;
    }
  }
  if (direction == "up") {
    // direction : up
    selectedPredictionPosition -= 1;
    if (selectedPredictionPosition <= -1) {
      -1;
    }
  }
  if (direction == "clear") {
    selectedPredictionPosition = -1;
  }
  updatePredictionListDocument();
};

const clearPredictions = () => {
  predictionList = [];
  lastQueried = "";
  selectedPredictionPosition = -1;
  updatePredictionListDocument();
};
