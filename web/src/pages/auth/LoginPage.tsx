import React, { useEffect, useState } from "react";
import { goHome, goPlans, goSignUpPage } from "../../constants/paths";
import {
  doLoginWithEmailAndPassword,
  EmailPasswordRequest,
  getAuthUser,
} from "../../firebase/auth";

import "./LoginPage.scss";

export const LoginPage = () => {
  useEffect(() => {
    getAuthUser().then((user) => {
      if (user) {
        goPlans();
      }
    });
  }, []);

  const [message, setMessage] = useState("Please login with your email");

  const doLogin = (request: EmailPasswordRequest) => {
    setMessage(`Try login ...`);

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
        console.error(error);
        setMessage(`${error}`);
      });
  };

  return (
    <div id="login-page">
      <h3 id="login-message">{message}</h3>
      <div id="login-form">
        <LoginFormComponent submit={doLogin} />
        <div id="signup-container">
          <label>Don't have account?</label>
          <button id="signup-button" className="text-button">
            SIGN UP
          </button>
        </div>
      </div>
    </div>
  );
};

function LoginFormComponent(props: {
  submit: (request: EmailPasswordRequest) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div id="login-form-component">
      <div id="email-form" className="input-form">
        <label>email</label>
        <input
          id="login-email-input"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <div id="password-form" className="input-form">
        <label>password</label>
        <input
          id="login-password-input"
          type="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          onKeyPress={(e) => {
            if (e.key == "Enter") {
              props.submit({ email, password });
            }
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
        LOGIN
      </button>
    </div>
  );
}
