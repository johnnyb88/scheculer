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


export default function Appointment(props) {

  const { mode, transition, back} = useVisualMode(props.interview ? SHOW : EMPTY);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    }
    transition(SAVE);

    props.bookInterview && props.bookInterview(props.id, interview)
      .then(() => {
        transition(SHOW)
      })
      .catch(() => {
        transition(ERROR_SAVE)
      });
  }

  function remove() {
    const interview = null;
    transition(DELETE);
    props.deleteInterview && props.deleteInterview(props.id, interview)
      .then(() => {
        transition(EMPTY)
      })
      .catch(() => {
        transition(ERROR_DELETE)
      });
  }

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
          <Confirm message={confirmMessage} onConfirm={() => remove()} onCancel={()=>back()}/>
        }
        {mode === EDIT &&
          <Form name={props.interview.student} onSave={(name, interviewer) => save(name, interviewer)} onCancel={() => back()} value={props.interview.interviewer.id} interviewers={props.interviewers}/>
        }
        {mode === ERROR_SAVE &&
          (props.interview ? 
            <Error message="Error on save! Please try again" onClose={() => transition(SHOW)}/>
            :
            <Error message="Error on save! Please try again" onClose={() => transition(EMPTY)}/>
          )
        }
        {mode === ERROR_DELETE &&
          <Error message="Error on delete! Please try again" onClose={() => transition(SHOW)}/>
        }
    </article>
  );
}