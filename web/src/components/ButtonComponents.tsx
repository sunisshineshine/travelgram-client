import React from "react";

export function DeleteButton(props: {
  onClick: (ev: React.MouseEvent) => void;
}) {
  return (
    <button id="delete-button" className="text-button" onClick={props.onClick}>
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
