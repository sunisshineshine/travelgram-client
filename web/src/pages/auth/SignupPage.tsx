import React, { useState } from "react";
import { goHome, goLoginPage } from "../../constants/paths";
import {
  createUserWithEmailPassword,
  EmailPasswordRequest,
} from "../../firebase/auth";

export const SignupPage = () => {
  const [message, setMessage] = useState("please fill the form");

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
    <div>
      <h1>SignUp Page</h1>
      <button onClick={goHome}>Go Main</button>
      <button onClick={goLoginPage}>Go Login</button>
      <div>{message}</div>
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
      <div id="signup-email-form">
        <label>email : </label>
        <input
          id="signup-email-input"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>
      <div id="signup-password-form">
        <label>password : </label>
        <input
          id="signup-password-input"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>
      <div id="signup-password-confirm-form">
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
