import React from "react";
import "components/Appointment/styles.scss";

import Header from "components/Appointment/Header";
import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";

import useVisualMode from "hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVE = "SAVE";
const ERROR_SAVE = "ERROR_SAVE";
const DELETE = "DELETE";
const ERROR_DELETE = "ERROR_DELETE";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const confirmMessage = "Are you sure?";

// ----- component that contains child views that will display depending on task of user. Create, edit, delete appointment. ----- //
export default function Appointment(props) {
  // ----- when props.interview contains a value pass the show mode if not then empty mode ----- //
  const { mode, transition, back} = useVisualMode(props.interview ? SHOW : EMPTY);

  // ----- pass this function to the form component that captures name and interviewer and pass to props.onSave as arguments ---- //
  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    }
    if (!interview.student || !interview.interviewer) {
      transition(ERROR_SAVE, true);
    } else {
    transition(SAVE);
    // ----- transition to show when put request is complete ----- //
    props.bookInterview(props.id, interview)
      .then(() => {
        transition(SHOW)
      })
      .catch(() => {
        transition(ERROR_SAVE, true)
      });
    }
  }

  // ---- destructive action that deletes the interview ----- //
  function destroy(event) {
    const interview = null;
    transition(DELETE, true);
    props.deleteInterview(props.id, interview)
      .then(() => {
        transition(EMPTY)
      })
      .catch(() => {
        transition(ERROR_DELETE, true)
      });
  }
  //----- when user clicks on the add appointment button, transition to the create mode ----- //
  return (
    <article className="appointment" key={props.id}>
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)}/>}
        {mode === SHOW && (
          <Show
            Appointment={props.id}
            student={props.interview.student}
            interviewer={props.interview.interviewer}
            onDelete={() => transition(CONFIRM)}
            onEdit={() => transition(EDIT)}
          />
        )}
        {mode === CREATE &&
        <Form onSave={(name, interviewer) => save(name, interviewer)} onCancel={() => back()} interviewers={props.interviewers}/>
        }
        {mode === SAVE &&
          <Status message={"Saving"} />
        }
        {mode === DELETE &&
          <Status message={"Deleting"} />
        }
        {mode === CONFIRM &&
          <Confirm message={confirmMessage} onConfirm={() => destroy()} onCancel={()=>back()}/>
        }
        {mode === EDIT &&
          <Form name={props.interview.student} onSave={(name, interviewer) => save(name, interviewer)} onCancel={() => back()} value={props.interview.interviewer.id} interviewers={props.interviewers}/>
        }
        {mode === ERROR_SAVE &&
          (props.interview ?
            <Error message="Error on save! Please try again" onClose={() => back()}/>
            :
            <Error message="Error on save! Please try again" onClose={() => back()}/>
          )
        }
        {mode === ERROR_DELETE &&
          <Error message="Error on delete! Please try again" onClose={() => transition(SHOW)}/>
        }
    </article>
  );
}