import React, { useState } from "react";

import * as PLACES from "../../firebase/functions/places";

let scheduledQuery = "";
let lastQueried = "";
const getPredictions = (
  query: string,
  onResult: (predictions: google.maps.places.AutocompletePrediction[]) => void
) => {
  // optimization for searching query
  // user will waiting for 0.5s, query will be searched
  scheduledQuery = query;
  setTimeout(() => {
    if (scheduledQuery == query && query != "" && lastQueried != query) {
      console.log(`get predictions with : ${query}`);
      lastQueried = query;

      PLACES.getPlaceAutocompletions(query)
        .then((predictions) => {
          onResult(predictions);
        })
        .catch((reason) => {
          console.log(reason);
        });
    }
  }, 500);
};

export const PlaceSearchBar = (props: {
  onAdded: (placeName: string, placeId: string) => void;
}) => {
  const [input, setInput] = useState("");
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [selectedPosition, setPosition] = useState(-1);

  const onQueryChanged = (props: { key: string }) => {
    const { key } = props;
    switch (key) {
      case "Enter":
        submitPlace(selectedPosition);
        return;

      case "ArrowDown":
        selectPrediction("down");
        return;

      case "ArrowUp":
        selectPrediction("up");
        return;

      default:
        setPosition(-1);

        if (input == "") {
          clearPredictions();
        } else {
          getPredictions(input, setPredictions);
        }
        return;
    }
  };

  // todo : sync with list and database
  const submitPlace = (position: number) => {
    if (position == -1) {
      position = 0;
    }

    if (predictions.length == 0) {
      return;
    }

    const selectedPrediction = predictions[position];
    if (selectedPrediction != null) {
      props.onAdded(
        selectedPrediction.structured_formatting.main_text,
        selectedPrediction.place_id
      );
      clearPredictions();
    }
  };

  const selectPrediction = (direction: "down" | "up" | "clear") => {
    if (direction == "down") {
      setPosition((prev) => prev + 1);
      if (selectedPosition >= predictions.length) {
        setPosition(predictions.length);
      }
    }
    if (direction == "up") {
      // direction : up
      setPosition((prev) => prev - 1);
      if (selectedPosition <= -1) {
        setPosition(-1);
      }
    }
    if (direction == "clear") {
      setPosition(-1);
    }
  };

  const clearPredictions = () => {
    setInput("");
    setPredictions([]);
    lastQueried = "";
    setPosition(-1);
  };

  const PredictionComponent = (props: {
    index: number;
    prediction: google.maps.places.AutocompletePrediction;
  }) => {
    const { index, prediction } = props;
    return (
      <div
        onClick={() => {
          console.log(index);
          submitPlace(index);
        }}
      >
        <p className={selectedPosition == index ? "active" : ""}>
          {prediction.structured_formatting.main_text}
        </p>
      </div>
    );
  };

  return (
    <div id="search-place">
      <input
        id="input"
        autoComplete="off"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        onKeyUp={(e) => {
          onQueryChanged({ key: e.key });
        }}
      />
      <div className="search-place-predictions">
        {predictions &&
          predictions.map((prediction, index) => (
            <PredictionComponent
              prediction={prediction}
              index={index}
              key={index}
            />
          ))}
      </div>
    </div>
  );
};
