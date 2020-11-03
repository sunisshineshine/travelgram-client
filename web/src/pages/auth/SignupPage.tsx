import React, { useState } from "react";
import { goHome } from "../../constants/paths";
import {
  createUserWithEmailPassword,
  EmailPasswordRequest,
} from "../../firebase/auth";

import "./SignupPage.scss";

export const SignupPage = () => {
  const [message, setMessage] = useState("Please sign up with your Email");

  const doSignUp = (request: EmailPasswordRequest) => {
    createUserWithEmailPassword(request).then((result) => {
      if (result.ok) {
        goHome();
      } else if (result.error_message) {
        setMessage(result.error_message.toString());
      }
    });
  };

  return (
    <div id="signup-page">
      <h3>{message}</h3>
      <SignupInputForm
        submit={(request, message) => {
          if (request) {
            doSignUp(request);
          } else if (message) {
            setMessage(message);
          }
        }}
      />
    </div>
  );
};

const SignupInputForm = (props: {
  submit: (props?: EmailPasswordRequest, message?: string) => void;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setpasswordConfirm] = useState("");
  return (
    <div className="signup-input-form">
      <div id="signup-email-form" className="input-form">
        <label>email</label>
        <input
          id="signup-email-input"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <div id="signup-password-form" className="input-form">
        <label>password : </label>
        <input
          id="signup-password-input"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>
      <div id="signup-password-confirm-form" className="input-form">
        <label>password : </label>
        <input
          id="signup-password-confirm-input"
          value={passwordConfirm}
          onChange={(e) => {
            setpasswordConfirm(e.target.value);
          }}
        />
      </div>
      <button
        id="signup-button"
        onClick={() => {
          if (password != passwordConfirm) {
            props.submit(undefined, "please check password confirm");
            return;
          }
          props.submit({
            email,
            password,
          });
        }}
      >
        Sign-up
      </button>
    </div>
  );
};
