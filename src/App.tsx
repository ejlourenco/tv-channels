import ReactGA from "react-ga";
import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import Moment from "moment";
import { DayNavigator } from "./components/DayNavigator";
import { HourNavigator } from "./components/HourNavigator";
import { ChannelBlock } from "./components/ChannelBlock";
import { Channel, Show, State } from "./model/Model";
import { ChannelShows } from "./components/ChannelShows";
import {
  ALL_OPTION_VALUE,
  DEFAULT_FILTER,
  getChannels,
  getOptionsByValues,
  getVideoUrl,
  useDebounce,
} from "./utils/Utils";

const TRACKING_ID = "G-FCJCN6L53X"; // YOUR_OWN_TRACKING_ID
ReactGA.initialize(TRACKING_ID);

const channelHeight = "3rem";

const defaultState: State = {
  timeBlock: {
    StartDate: Moment().startOf("hour"),
    Hours: 6,
  },
  channels: [],
  thematic: DEFAULT_FILTER,
  highlight: "",
  video: {
    running: false,
  },
};

function App() {
  const [data, setData] = useState<State>(defaultState);

  const vidRef = useRef(null);
  const debouncedHighlight = useDebounce(data.highlight, 500);

  useEffect(() => {
    // const catalog = "http://ott.online.meo.pt/catalog/v9/";
    const fetchChannels = async () => {
      const channels = await getChannels();
      const thematics = channels.map((channel) => channel.Thematic);
      const allThematicOptions = getOptionsByValues(thematics);
      setData((data) => ({
        ...data,
        channels,
        thematic: {
          ...data.thematic,
          options: allThematicOptions,
        },
      }));
    };
    fetchChannels();
  }, []);

  const addDay = (days: number) => {
    setData({
      ...data,
      timeBlock: {
        StartDate: Moment(data.timeBlock.StartDate).add(days, "days"),
        Hours: data.timeBlock.Hours,
      },
    });
  };

  const addHour = (hours: number) => {
    setData({
      ...data,
      timeBlock: {
        StartDate: Moment(data.timeBlock.StartDate).add(hours, "hours"),
        Hours: data.timeBlock.Hours,
      },
    });
  };

  const zoomChange = (zoom: number) => {
    setData({
      ...data,
      timeBlock: {
        StartDate: data.timeBlock.StartDate,
        Hours: zoom < 0 ? 2 * data.timeBlock.Hours : data.timeBlock.Hours / 2,
      },
    });
  };

  // @ts-ignore
  const hls = new Hls();
  const watchShow = (channel: Channel, show?: Show) => {
    ReactGA.event({
      category: "Show",
      action: "Watch",
      label: channel.Title + show ? " - " + show?.Title : "",
      value: parseInt((show?.Time || "").split(":").join("") || ""),
    });

    // do nothing
    setData({ ...data, video: { running: true, channel, show: show } });
    const url = getVideoUrl(channel, show);
    setTimeout(() => {
      const video = vidRef.current;
      hls.loadSource(url);
      hls.attachMedia(video);
      // @ts-ignore
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        // @ts-ignore
        video.play();
      });
    }, 1000);
  };
  const stopVideo = () => {
    ReactGA.event({
      category: "Video",
      action: "Back",
    });
    hls.stopLoad();
    setData({ ...data, video: { running: false } });
  };

  const getShowTitle = (show?: Show) => {
    return show?.Title || "";
  };

  const onFilterChange = (value: string) => {
    ReactGA.event({
      category: "Toolbar",
      action: "Filter",
      label: value,
    });

    setData((data) => ({
      ...data,
      thematic: { ...data.thematic, value: value },
    }));
  };

  const getVisibleChannels = (): Channel[] => {
    const { value } = data.thematic;
    const ret =
      value && value !== ALL_OPTION_VALUE
        ? data.channels.filter((channel) => channel.Thematic === value)
        : data.channels;
    // console.log({ ret });
    return ret;
  };

  const onSearch = (e: React.FormEvent<HTMLElement>) => {
    // @ts-ignore
    const text = e.target.value;
    ReactGA.event({
      category: "Toolbar",
      action: "Filter",
      label: text,
    });

    setData((data) => ({ ...data, highlight: text }));
  };

  return (
    <>
      {data.video.running && (
        <div>
          {data.video.channel !== undefined && (
            <p>
              {data.video.channel?.Title}
              {data.video.show !== undefined && (
                <>
                  <br />
                  {data.video.show.Title}
                </>
              )}
            </p>
          )}
          <video ref={vidRef} width="450" controls />
          {data.video.channel !== undefined && (
            <>
              <br />
              <a
                href={getVideoUrl(data.video.channel, data.video.show)}
                target="_blank"
                rel="noreferrer"
              >
                Open in a new tab
              </a>
            </>
          )}
          {data.video.show !== undefined && <p>{data.video.show.Synopsis}</p>}
          <button onClick={stopVideo}>back</button>
        </div>
      )}
      {!data.video.running && (
        <div style={{ overflowX: "hidden" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "10rem 20rem 1fr",
              gap: "1rem",
              height: "2rem",
              padding: "0.5rem",
              backgroundColor: "black",
            }}
          >
            <select
              // prefixCls={"Thematics"}
              value={data.thematic.value}
              style={{ width: "100%" }}
              onChange={(event: any) => onFilterChange(event.target.value)}
            >
              {data.thematic.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.title}
                </option>
              ))}
            </select>
            <input
              style={{ width: "100%" }}
              placeholder="input search text to highlight shows"
              onChange={onSearch}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "10rem calc(100vw - 10rem - 1px)",
              gap: "1px",
              alignContent: "center",
              justifyContent: "center",
              height: "2rem",
            }}
          >
            <DayNavigator date={data.timeBlock.StartDate} onAddDay={addDay} />
            <HourNavigator
              hourInterval={data.timeBlock.Hours}
              date={data.timeBlock.StartDate}
              onAddHour={addHour}
              onZoomChange={zoomChange}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "10rem calc(100vw - 10rem - 1px)",
              gap: "1px",
              overflow: "hidden auto",
              height: "calc(100vh - 5rem)",
            }}
          >
            <div>
              {getVisibleChannels().map((channel) => (
                <ChannelBlock
                  key={channel.Id}
                  channel={channel}
                  channelHeight={channelHeight}
                  onWatchShow={() => watchShow(channel)}
                ></ChannelBlock>
              ))}
            </div>
            <div style={{ maxWidth: "100%" }}>
              {getVisibleChannels().map((channel) => (
                <ChannelShows
                  key={channel.Id}
                  channel={channel}
                  channelHeight={channelHeight}
                  timeBlock={data.timeBlock}
                  highlight={debouncedHighlight}
                  onWatchShow={watchShow}
                ></ChannelShows>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
