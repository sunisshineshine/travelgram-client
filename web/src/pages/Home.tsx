import React, { useState, useEffect } from "react";

import * as PATHS from "../constants/paths";
import * as Navigator from "../navigator";
import { getAuthUser } from "../firebase/auth";

import {
  getPlaceAutocompletions,
  getPlaceDetail,
} from "../firebase/functions/places";

import * as PLANS from "../firebase/functions/plans";

import "./Home.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { PlansPage } from "./plan/Plans";

export const Home = () => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [places, setPlaces] = useState<string[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    console.log("getting plans");
    PLANS.getPlans().then((plans) => {
      console.log(plans);
      setPlans(plans);
    });
  }, []);

  getAuthUser().then((user) => {
    if (user) {
      setUser(user);
    } else {
      Navigator.goLoginPage();
    }
  });

  const placeAdded = (placeId: string) => {
    setPlaces((prev) => [...prev, placeId]);
  };

  const addPlan = () => {
    PLANS.createPlan("sample").then((result) => console.log(result));
  };

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
        <button onClick={addPlan}>Create Plan</button>
        {plans.map((plan) => {
          return plan.title;
        })}
        <h1>Welcome to yogurtravel</h1>
        <h2>{user.email}</h2>
        <p>describe your plan</p>
        {places &&
          places.map((placeId, index) => {
            return (
              <PlaceComponent key={index} index={index} placeId={placeId} />
            );
          })}
        <PlaceSearchBar onAdded={placeAdded} />
      </div>
    );
  }
};

const PlaceComponent = (props: { index: number; placeId: string }) => {
  const { placeId } = props;
  const [place, setPlace] = useState<google.maps.places.PlaceResult>();
  useEffect(() => {
    getPlaceDetail(placeId)
      .then((result) => {
        console.log(result);
        setPlace(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [placeId]);
  return <div>{place && place.name}</div>;
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

const PlaceSearchBar = (props: { onAdded: (placeId: string) => void }) => {
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
      props.onAdded(selectedPrediction.place_id);
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
