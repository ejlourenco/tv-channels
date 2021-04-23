import { Channel } from "../model/Model";

export const ChannelBlock = ({
  channel,
  channelHeight,
  onWatchShow,
}: {
  channel: Channel;
  channelHeight: string;
  onWatchShow: () => any;
}) => (
  <div
    title={channel.Description}
    style={{
      height: channelHeight,
      padding: "0 0.8rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderTop: "1px solid gray",
    }}
  >
    <span>{channel.Title}</span>
    <button onClick={() => onWatchShow()}>{">"}</button>
  </div>
  // </Popover>
);
