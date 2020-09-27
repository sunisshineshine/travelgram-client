import React, { useState, useEffect } from "react";

import * as Navigator from "../navigator";
import { getAuthUser } from "../firebase/auth";

import { getPlaceDetail } from "../firebase/functions/places";

import * as PLANS from "../firebase/functions/plans";

import "./Home.css";
import { PlaceSearchBar } from "../components/places/PlaceSearchBar";
import { goPlans } from "../constants/paths";
export const HomePage = () => {
  goPlans();

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
    PLANS.createPlan("sample", null, null).then((result) =>
      console.log(result)
    );
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
