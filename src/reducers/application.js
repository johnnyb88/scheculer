import { getSpotsForDay } from '../helpers/selectors';

export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";

// ----- will return a new state object each time it handles a dispatched action ----- //
export default function reducer( state, action ) {
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
            ...day,// ----- updates the number of spots remaining that day ----- //
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
