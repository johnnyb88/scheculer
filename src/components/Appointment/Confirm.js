import React from "react";
import Button from "components/Button";


/* ----- When user deletes thier appointment the confirm view is 
         used to make sure they want to. ----- */
export default function Confirm(props) {
  return (<main className="appointment__card appointment__card--confirm">
  <h1 className="text--semi-bold">{props.message}</h1>
  <section className="appointment__actions">
    <Button danger onClick={props.onCancel}>Cancel</Button>
    <Button danger onClick={props.onConfirm}>Confirm</Button>
  </section>
</main>);
}