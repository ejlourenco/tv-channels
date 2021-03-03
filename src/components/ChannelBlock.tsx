import { PlayCircleOutlined } from "@ant-design/icons";
import { Button, Card, Popover } from "antd";
import React from "react";
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
  <Popover
    content={
      <div
        style={{
          maxWidth: "20rem",
          maxHeight: "10rem",
          overflow: "auto",
        }}
      >
        {channel.Description}
      </div>
    }
  >
    <Card
      bodyStyle={{
        height: channelHeight,
        padding: "0.8rem",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <span>{channel.Title}</span>
      <Button
        size="small"
        icon={<PlayCircleOutlined />}
        onClick={() => onWatchShow()}
      />
    </Card>
  </Popover>
);
