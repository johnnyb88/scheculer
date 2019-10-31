import React from "react";

import InterviewerListItem from "./InterviewerListItem";
import "components/InterviewerList.scss";
/* PROPS
interviewers:array - an array of objects containing the information of each interviewer
interviewer:number - the id of an interviewer
onChangeInterviewer:function - a function that accepts an interviewer id
 */

 export default function InterviewerList(props) {

  return (
    <section className="interviewers">
  <h4 className="interviewers__header text--light">Interviewer</h4>
  <ul className="interviewers__list">
    {props.interviewers.map((interviewer) => {
      return <InterviewerListItem
        key={interviewer.id}
        name={interviewer.name}
        avatar={interviewer.avatar}
        selected={props.value === interviewer.id}
        onChangeInterviewer={() => {
         props.onChange(interviewer.id);
        }}
        />
    })}
  </ul>
</section>
  );
 }

 