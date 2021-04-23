import React, { useEffect, useRef, useState } from "react";
import { Channel, Interval, Show, TimeBlock } from "../model/Model";
import { ShowBlock } from "./ShowBlock";
import Moment from "moment";
import { getChannelShows, getInterval, useOnScreen } from "../utils/Utils";

const getShowPeriod = (show: Show): string => {
  const startDate = Moment(show.StartDate).format("HH:mm");
  return `${startDate}`;
  // const endDate = Moment(show.EndDate).format("HH:mm");
  // return `${startDate}-${endDate}`;
};

const getWidthByShow = (
  program: Show,
  interval: Interval,
  hourInterval: number
) => {
  const { StartDate, EndDate } = interval;
  let programStartDate = Moment(program.StartDate);
  let programEndDate = Moment(program.EndDate);
  if (programStartDate.isBefore(StartDate)) {
    programStartDate = Moment(StartDate);
  } else if (programEndDate.isAfter(EndDate)) {
    programEndDate = Moment(EndDate);
  }
  const durationMinutes = Moment(programEndDate).diff(
    programStartDate,
    "minute"
  );
  const percentageDuration =
    durationMinutes === 0 ? 0 : (100 * durationMinutes) / hourInterval / 60;
  // console.log({
  //   StartDate,
  //   EndDate,
  //   programStartDate,
  //   programEndDate,
  //   durationMinutes,
  //   percentageDuration,
  //   hourInterval,
  // });
  return `${percentageDuration}%`;
};

export const ChannelShows = ({
  channelHeight,
  channel,
  timeBlock,
  highlight,
  onWatchShow,
}: {
  channelHeight: string;
  channel: Channel;
  timeBlock: TimeBlock;
  highlight: string;
  onWatchShow: (channel: Channel, show: Show) => any;
}) => {
  const [data, setData] = useState<{ shows: Show[]; days: Moment.Moment[] }>({
    shows: [],
    days: [],
  });

  const ref = useRef(null);
  const isOnScreen = useOnScreen(ref);

  const interval = getInterval(timeBlock);

  useEffect(() => {
    const fetchChannelShows = async (day: Moment.Moment) => {
      const shows = await getChannelShows(channel, day);
      setData((data) => ({
        ...data,
        days: [...data.days, day],
        shows: [...data.shows, ...(shows || [])],
      }));
    };
    if (isOnScreen) {
      const { StartDate, EndDate } = interval;
      let date = Moment(StartDate).startOf("day");
      while (date.isBefore(Moment(EndDate).endOf("day"))) {
        if (!data.days.find((d) => d.isSame(date, "day"))) {
          const dateDay = date.startOf("day");
          fetchChannelShows(dateDay);
        }
        date = Moment(date).add(1, "day");
      }
    }
  }, [timeBlock, isOnScreen]);

  const getVisibleShows = (): Show[] => {
    const { StartDate, EndDate } = getInterval(timeBlock);
    let shows = data.shows
      .filter(
        (show) =>
          !Moment(show.EndDate).isBefore(StartDate) &&
          !Moment(show.StartDate).isAfter(EndDate)
      )
      .sort((a, b) =>
        Moment(a.StartDate).isBefore(Moment(b.StartDate)) ? -1 : 1
      );
    // console.log({ StartDate, EndDate, shows });
    return shows;
  };

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        maxWidth: "100%",
        borderTop: "1px solid gray",
        height: channelHeight,
      }}
    >
      {isOnScreen &&
        getVisibleShows().map((show) => (
          <ShowBlock
            key={show.Id}
            title={getShowPeriod(show) + " " + show.Title}
            synopsis={show.Synopsis}
            participants={show.Participants}
            width={getWidthByShow(show, interval, timeBlock.Hours)}
            onWatchShow={() => onWatchShow(channel, show)}
            isPlayButtonVisible={
              Moment(show.StartDate).isBefore(Moment()) &&
              Moment(show.StartDate).isAfter(Moment().add(-1, "d"))
            }
            highlight={highlight}
          ></ShowBlock>
        ))}
    </div>
  );
};
