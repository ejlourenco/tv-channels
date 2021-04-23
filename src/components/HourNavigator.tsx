import Moment from "moment";

type HourNavigatorPropType = {
  hourInterval: number;
  date: Moment.Moment;
  onAddHour: (hour: number) => void;
  onZoomChange: (zoom: number) => void;
};

export const HourNavigator = ({
  hourInterval,
  date,
  onAddHour,
  onZoomChange,
}: HourNavigatorPropType) => (
  <div
    style={{
      display: "flex",
      width: "100%",
      position: "relative",
      border: "1px solid gray",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        top: "0.3rem",
      }}
    >
      {Array.from({ length: hourInterval + 1 }).map((_v, diff) => (
        <label key={diff}>{Moment(date).add(diff, "h").format("HH:mm")}</label>
      ))}
    </div>
    <button
      style={{ position: "absolute", left: 0 }}
      onClick={() => onAddHour(-4)}
    >
      {"<<"}
    </button>
    <button
      style={{ position: "absolute", left: "2rem" }}
      onClick={() => onAddHour(-1)}
    >
      {"<"}
    </button>
    <button
      style={{ position: "absolute", left: "calc(50% - 3rem)" }}
      onClick={() => onZoomChange(-1)}
    >
      {"-"}
    </button>
    <button
      style={{ position: "absolute", right: "calc(50% - 3rem)" }}
      onClick={() => onZoomChange(1)}
    >
      {"+"}
    </button>
    <button
      style={{ position: "absolute", right: "2rem" }}
      onClick={() => onAddHour(1)}
    >
      {">"}
    </button>
    <button
      style={{ position: "absolute", right: 0 }}
      onClick={() => onAddHour(4)}
    >
      {">>"}
    </button>
  </div>
);
