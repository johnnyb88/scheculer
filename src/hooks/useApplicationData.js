import { useEffect, useReducer } from 'react';
import axios from 'axios';

import reducer, { SET_DAY, SET_APPLICATION_DATA, SET_INTERVIEW } from 'reducers/application';

// ----- loads the initial data from api, when any of the provided actions are called the state updates, causing the component to render ----- //
export default function useApplicationData() {
  // ----- add a days state ----- //
  const [state, dispatchState] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })
  // ----- setDay updates the state with the new day ----- //
  const setDay = day => dispatchState({
    type: SET_DAY,
    value: day
  });

  // ----- changes state when an interview is booked updates the local state ----- //
  function bookInterview(id, interview) {
    return (
      axios.put(`/api/appointments/${id}`, { interview })
      .then((response) => {
        dispatchState({ type: SET_INTERVIEW, id, interview })
      })
    )
  };
  // ----- makes an http request and updates(deletes interview) the local state ----- //
  function deleteInterview(id, interview) {
    return (
      axios.delete(`/api/appointments/${id}`, { interview })
      .then((response) => {
        dispatchState({ type: SET_INTERVIEW, id, interview })
      })
    )
  }
  // ----- updates the days, appointments, interviewers with the response ----- //
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ])
    .then((response) => {
      dispatchState({ type: SET_APPLICATION_DATA, value: response })
    })
  }, []);

  // ----- returns object with 4 keys ----- //
  return {
    state,
    setDay,
    bookInterview,
    deleteInterview
  }
}