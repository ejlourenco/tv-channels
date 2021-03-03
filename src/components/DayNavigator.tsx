import { LeftOutlined, RightOutlined } from "@ant-design/icons/lib/icons";
import Button from "antd/lib/button";
import React from "react";
import Moment from "moment";
import "./DayNavigator.css";

type DayNavigatorPropType = {
  date: Moment.Moment;
  onAddDay: (val: number) => void;
};

export const DayNavigator = ({ date, onAddDay }: DayNavigatorPropType) => {
  return (
    <div className="DayNavigator">
      <Button
        shape="circle"
        icon={<LeftOutlined />}
        onClick={() => onAddDay(-1)}
      />
      {Moment(date).format("ddd DD MMM")}
      <Button
        shape="circle"
        icon={<RightOutlined />}
        onClick={() => onAddDay(1)}
      />
    </div>
  );
};
