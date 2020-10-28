import React from "react";

export function OkButton(props: { onClick: (ev: React.MouseEvent) => void }) {
  return (
    <button id="ok-button" className="text-button" onClick={props.onClick}>
      ✔
    </button>
  );
}

export function CancelButton(props: {
  onClick: (ev: React.MouseEvent) => void;
}) {
  return (
    <button id="cancel-button" className="text-button" onClick={props.onClick}>
      ✖
    </button>
  );
}

export function EditButton(props: { onClick: (ev: React.MouseEvent) => void }) {
  return (
    <button id="edit-button" className="text-button" onClick={props.onClick}>
      ✎
    </button>
  );
}

export function NextButton(props: { onClick: (ev: React.MouseEvent) => void }) {
  return (
    <button id="next-button" className="text-button" onClick={props.onClick}>
      ⏩
    </button>
  );
}

export function PrevButton(props: { onClick: (ev: React.MouseEvent) => void }) {
  return (
    <button id="prev-button" className="text-button" onClick={props.onClick}>
      ⏪
    </button>
  );
}
