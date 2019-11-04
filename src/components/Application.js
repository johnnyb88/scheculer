import React, { useState, useEffect } from "react";
import Axios from 'axios';
import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "components/Appointment";
import useApplicationData from "hooks/useApplicationData";
import { getAppointmentsForDay, getInterviewersForDay, getInterview } from "helpers/selectors";


// ----- contains all components and renders schedule ----- //

export default function Application(props) {
  
  const {
    state,
    setDay,
    bookInterview,
    deleteInterview,
  } = useApplicationData();
  
  // ----- Create list of appointment components by iterating over appointments array ----- //
  const schedule = getAppointmentsForDay(state, state.day)
    .map((appointmentEntry) => {
      const interview = getInterview(state, appointmentEntry.interview);
      const interviewers = getInterviewersForDay(state, state.day);
      console.log(state.days);
      return (
        <Appointment
        {...appointmentEntry}
        key={appointmentEntry.id}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        deleteInterview={deleteInterview}
        />
      );
  });



      

  return (
    <main className="layout">
      <section className="sidebar">
        <img
  className="sidebar--centered"
  src="images/logo.png"
  alt="Interview Scheduler"
/>
<hr className="sidebar__separator sidebar--centered" />
<nav className="sidebar__menu" >
<DayList
  days={state.days} 
  day={state.day}
  setDay={setDay}
/>
</nav>
<img
  className="sidebar__lhl sidebar--centered"
  src="images/lhl.png"
  alt="Lighthouse Labs"
/>
      </section>
      <section className="schedule">
        {schedule}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
