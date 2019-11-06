import React from "react";

/* ----- By default (if no appointments scheduled) 
         renders an empty slot with a button for 
         the user to click to add an interview ----- */
export default function Empty(props) {
  return (
    <main className="appointment__add">
    <img
      className="appointment__add-button"
      src="images/add.png"
      alt="Add"
      data-testid="add"
      onClick={props.onAdd}
    />
  </main>
);
}