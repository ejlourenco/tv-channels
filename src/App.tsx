import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { Input, Layout, Modal, Space } from "antd";
import Moment from "moment";
import { DayNavigator } from "./components/DayNavigator";
import { HourNavigator } from "./components/HourNavigator";
import { ChannelBlock } from "./components/ChannelBlock";
import { Channel, Show, State, FilterOption } from "./model/Model";
import { ChannelShows } from "./components/ChannelShows";
import {
  ALL_OPTION_VALUE,
  DEFAULT_FILTER,
  getChannels,
  getOptionsByValues,
  getVideoUrl,
  useDebounce,
} from "./utils/Utils";
import { Select } from "antd";
import Search from "antd/lib/transfer/search";

const { Option } = Select;

const { Header, Sider, Content } = Layout;

const channelHeight = "3.4rem";

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
    // const video = vidRef.current;
    hls.stopLoad();
    setData({ ...data, video: { running: false } });
  };

  const getShowTitle = (show?: Show) => {
    return show?.Title || "";
  };

  const onFilterChange = (value: string) => {
    setData((data) => ({
      ...data,
      thematic: { ...data.thematic, value: value },
    }));
  };

  const getVisibleChannels = (): Channel[] => {
    const { value } = data.thematic;
    return value && value !== ALL_OPTION_VALUE
      ? data.channels.filter((channel) => channel.Thematic === value)
      : data.channels;
  };

  const onSearch = (e: React.FormEvent<HTMLElement>) => {
    // @ts-ignore
    setData((data) => ({ ...data, highlight: e.target.value }));
  };

  return (
    <>
      <Modal
        title={
          data.video.channel?.Title + " - " + getShowTitle(data.video.show)
        }
        centered
        visible={data.video.running}
        onCancel={stopVideo}
        destroyOnClose={true}
        footer={null}
      >
        <video ref={vidRef} width="450" controls />
        {data.video.channel !== undefined && (
          <a
            href={getVideoUrl(data.video.channel, data.video.show)}
            target="_blank"
          >
            Open in a new tab
          </a>
        )}
      </Modal>
      <Layout>
        <Header>
          <Space
            align="center"
            style={{ width: "100%", height: "100%", alignItems: "baseline" }}
          >
            <Select
              // prefixCls={"Thematics"}
              value={data.thematic.value}
              onChange={onFilterChange}
              style={{ width: "8rem" }}
            >
              {data.thematic.options.map((option) => (
                <Option value={option.value}>{option.title}</Option>
              ))}
            </Select>
            <Input
              style={{ width: "16rem" }}
              placeholder="input search text to highlight shows"
              onChange={onSearch}
            />
          </Space>
        </Header>
        <Layout>
          <Sider theme="light">
            <DayNavigator date={data.timeBlock.StartDate} onAddDay={addDay} />
          </Sider>
          <Content>
            <HourNavigator
              hourInterval={data.timeBlock.Hours}
              date={data.timeBlock.StartDate}
              onAddHour={addHour}
              onZoomChange={zoomChange}
            />
          </Content>
        </Layout>
        <Layout
          style={{
            overflowY: "auto",
            overflowX: "hidden",
            height: "calc(100vh - 6rem)",
          }}
        >
          <Sider theme="light">
            {getVisibleChannels().map((channel) => (
              <ChannelBlock
                key={channel.Id}
                channel={channel}
                channelHeight={channelHeight}
                onWatchShow={() => watchShow(channel)}
              ></ChannelBlock>
            ))}
          </Sider>
          <Content>
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
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default App;
