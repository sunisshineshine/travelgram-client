import React, { useContext, useEffect, useState } from "react";

import * as PLACES from "../../firebase/functions/places";
import { LoadingStateContext } from "../utils/Loading/LoadingModal";
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
  const searchPlace = (position: number) => {
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
  };

  const selectPrediction = (direction: "down" | "up" | "clear") => {
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
  };

  const clearPredictions = () => {
    setInput("");
    setPredictions([]);
    lastQueried = "";
    setPosition(-1);
  };

  return (
    <div
      id="place-search-bar-component"
      className="border-primary border-radius"
    >
      <div id="place-search-bar" className="flex-row ">
        <div className="icon">🔍</div>
        <input
          id="search-input"
          className="input"
          autoComplete="off"
          value={input}
          placeholder="search place at here.."
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
      <PredictionsComponent
        selected={selectedPosition}
        predictions={predictions}
      />
    </div>
  );
};

const PredictionsComponent = (props: {
  selected: number;
  predictions: google.maps.places.AutocompletePrediction[];
}) => {
  const { predictions } = props;
  const [selected, setSelected] = useState(props.selected);
  useEffect(() => {
    setSelected(props.selected);
  }, [props.selected]);

  return (
    <div
      id="predictions-component"
      style={{ display: predictions.length > 0 ? "block" : "none" }}
    >
      {predictions.map((prediction, index) => (
        <PredictionComponent
          highlight={index === selected}
          prediction={prediction}
        />
      ))}
    </div>
  );
};

const PredictionComponent = (props: {
  highlight: boolean;
  prediction: google.maps.places.AutocompletePrediction;
}) => {
  const { highlight, prediction } = props;
  return (
    <div
      id="prediction-component"
      className={highlight ? "selected" : ""}
      // className="selected"
      // onClick={() => {
      //   console.log(index);
      //   submitPlace(index);
      // }}
    >
      <div>
        <h3 id="place-name">{prediction.structured_formatting.main_text}</h3>
        <p id="description">{prediction.description}</p>
      </div>
    </div>
  );
};
