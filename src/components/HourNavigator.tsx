import React from "react";
import Moment from "moment";
import Button from "antd/lib/button";
import {
  BackwardOutlined,
  ForwardOutlined,
  LeftOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";

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
  <div style={{ display: "flex", width: "100%", position: "relative" }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        position: "absolute",
        top: "0.3rem",
      }}
    >
      {Array.from({ length: hourInterval + 1 }).map((_v, diff) => (
        <label key={diff}>{Moment(date).add(diff, "h").format("HH:mm")}</label>
      ))}
    </div>
    <Button
      shape="circle"
      icon={<BackwardOutlined />}
      style={{ position: "absolute", left: 0 }}
      onClick={() => onAddHour(-4)}
    />
    <Button
      shape="circle"
      icon={<LeftOutlined />}
      style={{ position: "absolute", left: "2rem" }}
      onClick={() => onAddHour(-1)}
    />
    <Button
      shape="circle"
      icon={<MinusCircleOutlined />}
      style={{ position: "absolute", left: "calc(50% - 3rem)" }}
      onClick={() => onZoomChange(-1)}
    />
    <Button
      shape="circle"
      icon={<PlusCircleOutlined />}
      style={{ position: "absolute", right: "calc(50% - 3rem)" }}
      onClick={() => onZoomChange(1)}
    />
    <Button
      shape="circle"
      icon={<RightOutlined />}
      style={{ position: "absolute", right: "2rem" }}
      onClick={() => onAddHour(1)}
    />
    <Button
      shape="circle"
      icon={<ForwardOutlined />}
      style={{ position: "absolute", right: 0 }}
      onClick={() => onAddHour(4)}
    />
  </div>
);
