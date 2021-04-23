export const ShowBlock = ({
  title,
  synopsis,
  participants,
  width,
  isPlayButtonVisible,
  highlight,
  onWatchShow,
}: {
  title: string;
  synopsis: string;
  participants: string;
  width: string;
  isPlayButtonVisible: boolean;
  highlight: string;
  onWatchShow: () => any;
}) => (
  <div
    title={`${synopsis}\n${participants || ""}`}
    style={{
      // position: "relative",
      // left: 0,
      width,
      padding: "1px",
      fontWeight:
        highlight === ""
          ? "inherit"
          : (title + " " + synopsis + " " + (participants || ""))
              .toLowerCase()
              .includes(highlight)
          ? "bold"
          : "lighter",
      borderLeft: "1px solid gray",
    }}
  >
    <div
      style={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {title}
    </div>
    {isPlayButtonVisible && (
      <button onClick={() => onWatchShow()}>{">"}</button>
    )}
  </div>
);
