import React, { useState } from "react";

import * as PLACES from "../../firebase/functions/places";
import "./PlaceSearchBarComponent.scss";

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
          console.log(predictions);
          onResult(predictions);
        })
        .catch((reason) => {
          console.log(reason);
        });
    }
  }, 500);
};

export const PlaceSearchBarComponent = (props: {
  onAdded: (place: google.maps.places.PlaceResult) => void;
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
      PLACES.getPlaceDetail(selectedPrediction.place_id).then((place) => {
        clearPredictions();
        props.onAdded(place);
      });
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
        className={"prediction-component"}
        onClick={() => {
          console.log(index);
          submitPlace(index);
        }}
      >
        <div className={selectedPosition == index ? "active" : ""}>
          <p>{prediction.structured_formatting.main_text}</p>
          <p>{prediction.description}</p>
        </div>
      </div>
    );
  };

  return (
    <div id="place-search-bar-component">
      <div
        id="place-search-bar"
        className="flex-row border-primary border-radius"
      >
        <div className="icon">🔍</div>
        <input
          id="search-input"
          className="input"
          autoComplete="off"
          value={input}
          onBlur={clearPredictions}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          onKeyUp={(e) => {
            onQueryChanged({ key: e.key });
          }}
        />
      </div>
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
