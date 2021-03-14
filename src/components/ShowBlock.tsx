import { PlayCircleOutlined } from "@ant-design/icons";
// import { Button, Card, Popover } from "antd";
import Button from "antd/es/button";
import Card from "antd/es/card/";
import Popover from "antd/es/popover";

import React from "react";

export const ShowBlock = ({
  title,
  synopsis,
  participants,
  width,
  channelHeight,
  isPlayButtonVisible,
  highlight,
  onWatchShow,
}: {
  title: string;
  synopsis: string;
  participants: string;
  width: string;
  channelHeight: string;
  isPlayButtonVisible: boolean;
  highlight: string;
  onWatchShow: () => any;
}) => (
  <Popover
    placement="bottom"
    title={title}
    content={
      <div
        style={{
          maxWidth: "20rem",
        }}
      >
        <div
          style={{
            maxHeight: "10rem",
            overflow: "auto",
          }}
        >
          <p>{synopsis}</p>
        </div>
        {participants && <p>{participants.split(",").join(", ")}</p>}
      </div>
    }
  >
    <Card
      style={{
        position: "relative",
        left: 0,
        width,
      }}
      bodyStyle={{
        height: channelHeight,
        padding: "0.2rem",
        fontWeight:
          highlight === ""
            ? "inherit"
            : (title + " " + synopsis + " " + participants)
                .toLowerCase()
                .includes(highlight)
            ? "bold"
            : "lighter",
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
        <Button
          size="small"
          icon={<PlayCircleOutlined />}
          onClick={() => onWatchShow()}
        />
      )}
    </Card>
  </Popover>
);
