import React, { useContext, useEffect, useState } from "react";

import * as PLACES from "../../firebase/functions/places";
import { SearchIcon } from "../Icons";
import { LoadingStateContext } from "../utils/Loading/LoadingModal";
import "./PlaceSearchBarComponent.scss";

let scheduledQuery = "";
let lastQueried = "";
function getPredictions(
  query: string,
  onResult: (predictions: google.maps.places.AutocompletePrediction[]) => void
) {
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
          console.error("cannot get place search predictions", reason);
          onResult([]);
        });
    }
  }, 500);
}

export const PlaceSearchBarComponent = (props: {
  onSearched: (place: google.maps.places.PlaceResult) => void;
}) => {
  const [input, setInput] = useState("");
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [selectedPosition, setPosition] = useState(-1);

  const onKeyPressed = (props: { key: string }) => {
    const { key } = props;
    switch (key) {
      case "Enter":
        searchPlace(selectedPosition);
        return;

      case "ArrowDown":
        selectPrediction("down");
        return;

      case "ArrowUp":
        selectPrediction("up");
        return;

      default:
        setPosition(-1);
    }
  };

  const setLoading = useContext(LoadingStateContext)![1];
  function searchPlace(position: number) {
    if (position == -1 || predictions.length === 0) {
      return;
    }

    const selectedPrediction = predictions[position];
    if (selectedPrediction != null) {
      setLoading({ activated: true, message: "searching place" });
      PLACES.getPlaceDetail(selectedPrediction.place_id).then((place) => {
        setLoading({ activated: false });
        clearPredictions();
        props.onSearched(place);
      });
    }
  }

  function selectPrediction(direction: "down" | "up" | "clear") {
    let position = selectedPosition;
    switch (direction) {
      case "down":
        position += 1;
        if (position >= predictions.length) {
          position = 0;
        }
        break;
      case "up":
        position -= 1;
        if (position <= -1) {
          position = -1;
        }
        break;
    }
    setPosition(position);
    const place = predictions[position].structured_formatting.main_text;
    if (place && predictions) {
      setInput(place);
    }
  }

  function clearPredictions() {
    setInput("");
    setPredictions([]);
    lastQueried = "";
    setPosition(-1);
  }

  const [isFocused, setFocused] = useState(false);

  return (
    <div id="place-search-bar-component">
      <div id="place-search-bar" className="flex-row ">
        <SearchIcon />
        <input
          id="search-input"
          className="input"
          autoComplete="off"
          value={input}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="...search place at here"
          // onBlur={clearPredictions}
          onChange={(e) => {
            setInput(e.target.value);
            if (e.target.value === "") {
              clearPredictions();
            } else {
              getPredictions(input, setPredictions);
            }
          }}
          onKeyUp={(e) => {
            onKeyPressed({ key: e.key });
          }}
        />
      </div>
      <div style={{ display: isFocused ? "block" : "none" }}>
        <PredictionsComponent
          selected={selectedPosition}
          predictions={predictions}
          onSelected={searchPlace}
        />
      </div>
    </div>
  );
};

const PredictionsComponent = (props: {
  selected: number;
  predictions: google.maps.places.AutocompletePrediction[];
  onSelected: (position: number) => void;
}) => {
  const { predictions } = props;
  const [selected, setSelected] = useState(props.selected);
  useEffect(() => {
    setSelected(props.selected);
  }, [props.selected]);

  return (
    <div
      id="predictions-component"
      // style={{ display: predictions.length > 0 ? "block" : "none" }}
    >
      {predictions.length > 0 ? (
        <div id="predictions">
          {predictions.map((prediction, index) => (
            <PredictionComponent
              highlight={index === selected}
              prediction={prediction}
              onSelected={() => {
                props.onSelected(index);
              }}
            />
          ))}
        </div>
      ) : (
        <div>
          <p>searched place not exist.</p>
        </div>
      )}
    </div>
  );
};

const PredictionComponent = (props: {
  highlight: boolean;
  prediction: google.maps.places.AutocompletePrediction;
  onSelected: () => void;
}) => {
  const { highlight, prediction } = props;
  return (
    <div
      id="prediction-component"
      className={highlight ? "selected" : ""}
      onClick={props.onSelected}
    >
      <div>
        <p id="place-name">{prediction.structured_formatting.main_text}</p>
        <p id="description">{prediction.description}</p>
      </div>
    </div>
  );
};
