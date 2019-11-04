import { useEffect, useReducer } from 'react';
import Axios from 'axios';



const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

// ----- finds spots for given day ----- //
function getSpotsForDay( state, dayName ) {
  return state.days
    .find( day => {
      return day.name === dayName;
    } )
    .appointments.filter( appointment => {
      return state.appointments[ appointment ].interview === null;
    } ).length;
}

// ----- will return a new state object each time it handles a dispatched action ----- //
function reducer( state, action ) {
  switch ( action.type ) {
    case SET_DAY:
      return ( {
        ...state,
        day: action.value
      } );

    case SET_APPLICATION_DATA:
      return ( {
        ...state,
        days: action.value[ 0 ].data,
        appointments: action.value[ 1 ].data,
        interviewers: action.value[ 2 ].data
      } );

    case SET_INTERVIEW:
      const appointment = {
        ...state.appointments[ action.id ],
        interview: action.interview && { ...action.interview }
      }

      const appointments = {
        ...state.appointments,
        [ action.id ]: appointment
      }

      const newState = {
        ...state,
        appointments
      }
      const dayWithAppointment = state.days.find( dayEntry => dayEntry.appointments.includes( action.id ) );
      
      const days = state.days.map( ( day ) => {
        if ( day.name === dayWithAppointment.name ) {
          return {
            ...day, // ----- updates the number of spots remaining that day ----- //
            spots: getSpotsForDay( newState, dayWithAppointment.name )
          }
        } else {
          return day
        }
      } );

      return ( {
        ...state,
        appointments,
        days
      } );

    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      )
  }
}
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
      Axios.put(`/api/appointments/${id}`, { interview })
      .then((response) => {
        dispatchState({ type: SET_INTERVIEW, id, interview })
      })
    )
  };
  // ----- makes an http request and updates(deletes interview) the local state ----- //
  function deleteInterview(id, interview) {

    return (
      Axios.delete(`/api/appointments/${id}`, { interview })
      .then((response) => {
        dispatchState({ type: SET_INTERVIEW, id, interview })
      })
    )
  }
  // ----- updates the days, appointments, interviewers with the response ----- //
  useEffect(() => {
    Promise.all([
      Axios.get("/api/days"),
      Axios.get("/api/appointments"),
      Axios.get("/api/interviewers"),
    ])
    .then((response) => {
      dispatchState({ type: SET_APPLICATION_DATA, value: response })
    })
  }, [state.days]);

  // ----- returns object with 4 keys ----- //
  return {
    state,
    setDay,
    bookInterview,
    deleteInterview
  }
}