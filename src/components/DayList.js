import React from "react";
import DayListItem from "./DayListItem"

/* PROPS
days:Array a list of day objects (each object includes an id, name, and spots)
day:String the currently selected day
setDay:Function accepts the name of the day eg. "Monday", "Tuesday" 
*/


export default function DayList(props) {

    return (
      <ul>
        {props.days.map((day) => {
          return (
            <li>
              <DayListItem
              key={day.id}
              name={day.name}
              spots={day.spots}
              selected={day.name === props.day}
              setDay={() => {
                return props.setDay(day.name)
              }}
              />
            </li>
          )
        })}
      </ul>
    );
}


