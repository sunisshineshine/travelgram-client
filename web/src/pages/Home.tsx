import React, { useState, useEffect } from "react";

import * as Navigator from "../navigator";
import { getAuthUser } from "../firebase/auth";

import { getPlaceAutocompletions } from "../firebase/functions";

import "./Home.css";

export const Home = () => {
  const [user, setUser] = useState<firebase.User | null>(null);

  getAuthUser().then((user) => {
    if (user) {
      setUser(user);
    } else {
      Navigator.goLoginPage();
    }
  });
  if (user == null) {
    // loading user information
    return (
      <div className="home">
        <p>Getting user information...</p>
      </div>
    );
  } else {
    // display with user
    return (
      <div className="home">
        <h1>Welcome to yogurtravel</h1>
        <h2>{user.email}</h2>
        <p>describe your plan</p>
        <div id="plan-list"></div>
        <PlaceSearchBar />
      </div>
    );
  }
};

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

      getPlaceAutocompletions(query)
        .then((predictions) => {
          onResult(predictions);
        })
        .catch((reason) => {
          console.log(reason);
        });
    }
  }, 500);
};

const PlaceSearchBar = () => {
  const [input, setInput] = useState("");
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [selectedPosition, setPosition] = useState(-1);

  const onQueryChanged = (props: { key: string }) => {
    const { key } = props;
    switch (key) {
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
        if (input == "") {
          clearPredictions();
        } else {
          getPredictions(input, setPredictions);
        }
        return;
    }
  };

  // todo : sync with list and database
  const submitPlace = () => {
    if (selectedPosition == -1) {
      setPosition(0);
    }
    const selectedPrediction = predictions[selectedPosition];
    if (selectedPrediction != null) {
      // addPlanItem(selectedPrediction);
      console.log(selectedPrediction);
      clearPredictions();
      setInput("");
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
    p+rediction: google.maps.places.AutocompletePrediction;
  }) => {
    const { prediction } = props;
    return (
      <div>
        <p className={selectedPosition == props.index ? "active" : ""}>
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
      <div id="search-place-predictions">
        {predictions.map((prediction, index) => (
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
