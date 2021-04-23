import Moment from "moment";
import "./DayNavigator.css";

type DayNavigatorPropType = {
  date: Moment.Moment;
  onAddDay: (val: number) => void;
};

export const DayNavigator = ({ date, onAddDay }: DayNavigatorPropType) => {
  return (
    <div className="DayNavigator">
      <button onClick={() => onAddDay(-1)}>{"<"}</button>
      {Moment(date).format("ddd DD MMM")}
      <button onClick={() => onAddDay(1)}>{">"}</button>
    </div>
  );
};
