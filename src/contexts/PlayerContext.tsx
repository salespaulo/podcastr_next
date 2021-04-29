import { useState, createContext, ReactNode, useContext } from "react";

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffe: boolean;
  play: (episode: Episode) => void;
  playList: (episode: Episode[], index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  setPlaying: (flag: boolean) => void;
  tooglePlay: () => void;
  toogleLoop: () => void;
  toogleShuffe: () => void;
  clearPlayerState: () => void;
};

export const PlayerContext = createContext({} as PlayerContextData);

export const usePlayer = () => {
  return useContext(PlayerContext);
};

type PlayerContextProviderProps = {
  children: ReactNode;
};

export default function PlayerContextProvider({
  children,
}: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffe, setIsShuffe] = useState(false);

  function play(episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  const hasNext = isShuffe || currentEpisodeIndex + 1 < episodeList.length;
  const hasPrevious = isShuffe || currentEpisodeIndex > 0;

  function randomEpisode() {
    const aux = Math.floor(Math.random() * episodeList.length);
    if (aux === currentEpisodeIndex) {
      return randomEpisode();
    }

    return aux;
  }

  function playNext() {
    if (isShuffe) {
      const nextEpisodeIndex = randomEpisode();
      return setCurrentEpisodeIndex(nextEpisodeIndex);
    }

    if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }

  function playPrevious() {
    if (isShuffe) {
      const nextEpisodeIndex = randomEpisode();
      return setCurrentEpisodeIndex(nextEpisodeIndex);
    }

    if (currentEpisodeIndex > 0) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  function tooglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toogleLoop() {
    setIsLooping(!isLooping);
  }

  function toogleShuffe() {
    setIsShuffe(!isShuffe);
  }

  function setPlaying(flag) {
    setIsPlaying(flag);
  }

  function clearPlayerState() {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        isShuffe,
        hasNext,
        hasPrevious,
        play,
        playList,
        playNext,
        playPrevious,
        toogleLoop,
        tooglePlay,
        toogleShuffe,
        setPlaying,
        clearPlayerState,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
