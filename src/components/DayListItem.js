import React from "react";
import "components/DayListItem.scss";
import classNames from 'classnames';


/* props
name: String - the name of the day
spots: Number - the number of spots remaining`
selected: Boolean - true or false declaring that this day is selected
setDay: Function accepts the name of the day
*/

export default function DayListItem(props) {

  let dayClass = classNames('day-list__item', {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
 });

 const formatSpots = function() {
      switch (props.spots) {
        case 0:
          return `no spots remaining`;
          // break;
        case 1:
          return `1 spot remaining`
          // break;
        default:
          return `${props.spots} spots remaining`;
      }
    }

  return (
    <li className={dayClass} onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots()}</h3>
    </li>
  );
}

// ReactDom.render(
//   <DayListItem
//   name={day.name}
//   spots={day.spots}
//   selected={day.name === props.day}
//   setDay={props.setDay}
//   />,
//   document.getElementById("root")
// );

