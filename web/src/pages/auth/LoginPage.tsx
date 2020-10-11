import React, { useEffect, useState } from "react";
import { goPlans } from "../../constants/paths";
import {
  doLoginWithEmailAndPassword,
  EmailPasswordRequest,
  getAuthUser,
} from "../../firebase/auth";
import { goHome, goSignUpPage } from "../../navigator";

export const LoginPage = () => {
  useEffect(() => {
    getAuthUser().then((user) => {
      if (user) {
        goPlans();
      }
    });
  }, []);

  const [message, setMessage] = useState("Please Login");

  const doLogin = (request: EmailPasswordRequest) => {
    doLoginWithEmailAndPassword(request)
      .then((result) => {
        if (result.ok) {
          goHome();
        } else {
          if (result.error_message) {
            setMessage(result.error_message?.toString());
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div id="login-page">
      <h1>Log-in Page</h1>
      <button id="main-button" onClick={goHome}>
        Back to Main
      </button>
      <p id="login-message">{message}</p>
      <div id="login-form">
        <LoginInputForm submit={doLogin} />
        <p>
          Do you have no account?{" "}
          <button id="signup-button" onClick={goSignUpPage}>
            SignUp!
          </button>
        </p>
      </div>
    </div>
  );
};

const LoginInputForm = (props: {
  submit: (props: EmailPasswordRequest) => void;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="login-input-form">
      <div id="login-email-form">
        <label>email : </label>
        <input
          id="login-email-input"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <div id="login-password-form">
        <label>password : </label>
        <input
          id="login-password-input"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>
      <button
        id="login-button"
        onClick={() => {
          props.submit({
            email,
            password,
          });
        }}
      >
        Log-in
      </button>
    </div>
  );
};
