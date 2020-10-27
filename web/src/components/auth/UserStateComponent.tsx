import React, { useEffect, useState } from "react";
import { User } from "firebase";
import { doSignOut, getAuthUser } from "../../firebase/auth";
import { goLoginPage, goSignUpPage } from "../../constants/paths";
import "./UserStateComponent.scss";

export function UserStateComponent() {
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getAuthUser().then((user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div id="user-state-component">
        <p>Getting User state...</p>
      </div>
    );
  }

  return (
    <div id="user-state-component">
      {user ? <UserProfileComponent user={user} /> : <LoginRequireComponent />}
    </div>
  );
}

function LoginRequireComponent() {
  return (
    <div id="login-require-component">
      <p>Please Login first</p>

      <div id="nav-buttons">
        <div>
          <label>already have account?</label>
          <button
            id="login-button"
            className="text-button"
            onClick={goLoginPage}
          >
            LOGIN
          </button>
        </div>

        <div>
          <label>or </label>
          <button
            id="login-button"
            className="text-button"
            onClick={goSignUpPage}
          >
            SIGN UP
          </button>
        </div>
      </div>
    </div>
  );
}

const onSignOutButtonClicked = () => {
  doSignOut().then(() => {
    window.location.reload();
  });
};

const UserProfileComponent = (props: { user: User }) => {
  const { user } = props;
  return (
    <div id="user-profile-component" style={{ color: "white" }}>
      <p>Welcome, {user.displayName || "UNKNOWN"}</p>
      <button id="signout-button" onClick={onSignOutButtonClicked}>
        SIGN OUT
      </button>
    </div>
  );
};
