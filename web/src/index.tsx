import React from "react";
import { render } from "react-dom";

import { App, ContextProviders } from "./App";
import "./index.scss";

render(
  <ContextProviders>
    <App />
  </ContextProviders>,
  document.getElementById("root")
);
