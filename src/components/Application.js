import React, { useState, useEffect } from "react";
import Axios from 'axios';
import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterviewersForDay, getInterview }from "helpers/selectors";




export default function Application(props) {
  
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })
  
  const setDay = day => setState(currentState => ({ ...currentState, day }));  
  const appointments = getAppointmentsForDay(state, state.day);
  const schedule = appointments.map((appointmentEntry) => {
  const interview = getInterview(state, appointmentEntry.interview);
  const interviewers = getInterviewersForDay(state, state.day);
  return (
    <Appointment 
      {...appointmentEntry}
      key={appointmentEntry.id} 
      interview={interview}
      interviewers={interviewers}
      bookInterview={bookInterview}
      deleteInterview={deleteInterview}
      editInterview={editInterview}
    />
  );
});

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return (
      Axios.put(`/api/appointments/${id}`, { interview })
      .then((response) => {
        setState((currentState) => {
          return {
            ...currentState,
            appointments
          };
        })
      })
    )
  };

  function deleteInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    }
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    return (
      Axios.delete(`/api/appointments/${id}`, { interview })
      .then((response) => {
        setState((currentState) => {
          return {
            ...currentState,
            appointments
          }
        })
      })
    )
  }

  function editInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview
    }
    const appointments = {
      ...state.appoinments,
      [id]: appointment
    }

    return (
      Axios.put(`/api/appointments/${id}`, { interview })
      .then((response) => {
        setState((currentState) => {
          return {
            ...currentState,
            appointments
          }
        })
      })
      .catch((error) => {
        console.error(error);
      })
    )
  }



  useEffect(() => {
    Promise.all([
      Axios.get("/api/days"),
      Axios.get("/api/appointments"),
      Axios.get("/api/interviewers"),
    ]).then((response) => {
      setState(state => ({ 
        ...state, 
        days: response[0].data, 
        appointments: response[1].data, 
        interviewers: response[2].data
      }));
    })
  }, []);
      

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
