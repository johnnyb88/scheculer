export function getAppointmentsForDay(state, day) {

  const resultDay = state.days.find((dayEntry) => {
    return dayEntry.name === day;
  });
  const appointmentIdArray = resultDay ? resultDay.appointments : [];
  const resultArray = [];

  appointmentIdArray.forEach((appointmentId) => {
    resultArray.push(state.appointments[appointmentId])
  })
  return resultArray;
};
