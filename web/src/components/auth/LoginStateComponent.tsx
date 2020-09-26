import React, { useEffect, useState } from "react";
import { User } from "firebase";
import { doSignOut, getAuthUser } from "../../firebase/auth";

export const LoginStateComponent = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getAuthUser().then((user) => {
      setUser(user);
    });
  }, []);
  return (
    <div className="login-state-component">
      {user ? <UserState user={user} /> : <p>Please login first</p>}
    </div>
  );
};

const onSignOutButtonClicked = () => {
  doSignOut().then(() => {
    window.location.reload();
  });
};

const UserState = (props: { user: User }) => {
  const { user } = props;
  return (
    <div className="user-state">
      <p>{user.email}</p>
      <button onClick={onSignOutButtonClicked}>sign-out</button>
    </div>
  );
};
