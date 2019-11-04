// ---- returns an array of appointments for the given day ----- //
function getAppointmentsForDay(state, day) {

  // ----- finds object in state.days array who's name matches the provided day ----- //
  const resultDay = state.days.find((dayEntry) => {
    return dayEntry.name === day;
  });
  // ----- iterate through appointment array for fay comparing where its id matches the id of states.appointment ----- //
  // ----- if no appointments for given day return empty array ----- //
  const appointmentIdArray = resultDay ? resultDay.appointments : [];
  const resultArray = [];
  
  appointmentIdArray.forEach((appointmentId) => {
    resultArray.push(state.appointments[appointmentId])
  })
  return resultArray;
};

// ----- return a new object containing interview data when passed an object that contains the interviewer or null ----- //
function getInterview(state, interview) {
  if (interview) {
    return ({
      student: interview.student,
      interviewer: state.interviewers[interview.interviewer]
    })
  } else {
    return null;
  }
};
// ----- returns an array of interviewers for given day ----- //
function getInterviewersForDay(state, day) {
  const resultDay = state.days.find((dayEntry) => {
    return dayEntry.name === day;
  });
  const interviewersArray = resultDay ? resultDay.interviewers : [];
  const resultArray = [];
  interviewersArray.forEach((interviewersKey) => {
    resultArray.push(state.interviewers[interviewersKey]) 
  })
  return resultArray;
}

export { getAppointmentsForDay, getInterviewersForDay, getInterview } 