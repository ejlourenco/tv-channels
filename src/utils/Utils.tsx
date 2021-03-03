import {
  Channel,
  Filter,
  FilterOption,
  Interval,
  Show,
  TimeBlock,
} from "../model/Model";
import Moment from "moment";
import { useEffect, useState } from "react";

const exaustODataEndpoint = async (url: string, all = true): Promise<any> => {
  const response = await fetch(url);
  const decodedResponse = await response.json();
  const data = decodedResponse.value;
  const nextLink = decodedResponse["odata.nextLink"];
  if (nextLink && all) {
    const nextData = await exaustODataEndpoint(nextLink, all);
    return [...data, ...nextData];
  } else {
    return data;
  }
};

export const getChannels = async (): Promise<Channel[]> => {
  let channels: Channel[] = await exaustODataEndpoint(
    "http://ott.online.meo.pt/catalog/v9/Channels?UserAgent=IPTV_OFR_AND&OfferId=21600543&$orderby=ChannelPosition%20asc&$inlinecount=allpages",
    true
  );
  // channels = [channels[0], channels[1], channels[2], channels[3], channels[4]];
  return channels;

  // const programsByChannel = await Promise.all(
  //   channels.map((channel: any) => fetchChannelData(channel, data.date))
  // );
  // const dataByChannel = programsByChannel.reduce<DataByChannel>(
  //   (acc, pro, index) => ({ ...acc, [channels[index].Id]: pro }),
  //   {}
  // );
};

export const getChannelShows = async (
  channel: Channel,
  day: Moment.Moment
): Promise<Show[]> => {
  const dateFormat = "YYYY-MM-DDTHH:mm:ss";
  const startDate = Moment(day).add(-1, "day").endOf("day").format(dateFormat);
  const endDate = Moment(day).add(1, "day").startOf("day").format(dateFormat);
  return await exaustODataEndpoint(
    `http://ott.online.meo.pt/Program/v9/Programs?UserAgent=IOS&$orderby=StartDate%20asc&$filter=CallLetter%20eq%20%27${channel.CallLetter}%27%20and%20StartDate%20gt%20datetime%27${startDate}%27%20and%20StartDate%20lt%20datetime%27${endDate}%27%20and%20IsEnabled%20eq%20true%20and%20IsBlackout%20eq%20false&$inlinecount=allpages`
  );

  // const result = await axios(`http://services.sapo.pt/EPG/GetChannelByDateInterval?channelSigla=${channelNick}&startDate=${startDate}&endDate=${endDate}`);
};

export const getInterval = (timeBlock: TimeBlock): Interval => {
  return {
    StartDate: timeBlock.StartDate,
    EndDate: Moment(timeBlock.StartDate).add(timeBlock.Hours, "hours"),
  };
};

export function useOnScreen(ref: any, rootMargin = "0px") {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update our state when observer callback fires
        setIntersecting(
          entry.isIntersecting && entry.boundingClientRect.height > 0
        );
      },
      {
        rootMargin,
      }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return isIntersecting;
}

export const ALL_OPTION_VALUE = "_all";
export const ALL_OPTION: FilterOption<string> = {
  value: ALL_OPTION_VALUE,
  title: "All",
};

export const DEFAULT_FILTER: Filter<string> = {
  value: ALL_OPTION_VALUE,
  options: [ALL_OPTION],
};

export const getOptionsByValues = (
  values: string[]
): FilterOption<string>[] => {
  // @ts-ignore
  const uniqueValues: string[] = [...new Set(values)];
  const options: FilterOption<string>[] = uniqueValues.map((v) => ({
    value: v,
    title: v,
  }));
  return [ALL_OPTION, ...options];
};

export const getVideoUrl = (channel: Channel, show?: Show): string => {
  const { FriendlyUrlName } = channel;
  const { StartDate, EndDate } = show
    ? show
    : { StartDate: Moment(), EndDate: null };
  const formattedStartDate = Moment(StartDate).format("YYYY-MM-DDTHH:mm:00");
  const formattedEndDate = EndDate
    ? Moment(EndDate).format("YYYY-MM-DDTHH:mm:00")
    : "END";
  return `http://213.13.23.76/wp/cdn-vspp-pcs1.online.meo.pt/shls/LIVE$${FriendlyUrlName}/index.m3u8?device=IOS_Live&start=${formattedStartDate}&end=${formattedEndDate}`;
};

export const useDebounce = (value: string, timeout: number) => {
  const [state, setState] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setState(value), timeout);

    return () => clearTimeout(handler);
  }, [value, timeout]);

  return state;
};
