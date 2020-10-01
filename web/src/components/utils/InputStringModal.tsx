import React, { useState } from "react";
import "./InputStringModal.css";

export const InputStringModal = (props: {
  activated: boolean;
  title: string;
  placeholder?: string;
  onCall: (input: string) => void;
}) => {
  const [input, setInput] = useState(props.placeholder || "");

  return (
    <div
      className="input-string-modal"
      style={{ display: props.activated ? "block" : "none" }}
    >
      <div className="content">
        <div>
          <label>{props.title}</label>
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
          <button
            onClick={() => {
              props.onCall(input);
            }}
          >
            submit
          </button>
        </div>
      </div>
    </div>
  );
};
