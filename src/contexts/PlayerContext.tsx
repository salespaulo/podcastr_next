import { createContext } from "react";

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: string;
  url: string;
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  play: (episode) => void;
  tooglePlay: () => void;
  setPlaying: (flag) => void;
};

export const PlayerContext = createContext({} as PlayerContextData);
