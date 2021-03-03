import Moment from "moment";

export interface Interval {
  StartDate: Moment.Moment;
  EndDate: Moment.Moment;
}

export interface TimeBlock {
  StartDate: Moment.Moment;
  Hours: number;
}

export interface Channel {
  Id: number;
  Title: string;
  FriendlyUrlName: string;
  CallLetter: string;
  Thematic: string;
  Description: string;
}

export interface Show {
  Id: number;
  Title: string;
  Time: string;
  Synopsis: string;
  StartTime: string;
  StartDate: string;
  EndDate: string;
  Participants: string;
}

export interface FilterOption<T> {
  value: T;
  title: string;
}

export interface Filter<T> {
  value: T;
  options: FilterOption<T>[];
}

export interface State {
  timeBlock: TimeBlock;
  channels: Channel[];
  thematic: Filter<string>;
  highlight: string;
  video: {
    running: boolean;
    channel?: Channel;
    show?: Show;
  };
}
