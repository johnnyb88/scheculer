import React, { useState } from "react";
import "components/InterviewerListItem.scss";
import classNames from 'classnames';

/*PROPS
id:number - the id of the interviewer
name:string - the name of the interviewer
avatar:url - a url to an image of the interviewer
selected:boolean - to determine if an interview is selected or not
setInterviewer:function - sets the interviewer upon selection
*/

export default function InterviewerListItem(props) {
  const interviewerClass = classNames("interviewers__item", {
    "interviewers__item--selected": props.selected,
  });
  return (
    <li className="interviewers__item">
      <img
      className="interviewers__item-image"
      src="https://i.imgur.com/LpaY82x.png"
      alt="Sylvia Palmer"
      />
    Sylvia Palmer
    </li>
  )
}