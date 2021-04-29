import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Slider from "rc-slider";

import "rc-slider/assets/index.css";

import { usePlayer } from "../../contexts/PlayerContext";
import styles from "./styles.module.scss";
import { convertDuration } from "../../utils/date";

export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffe,
    hasNext,
    hasPrevious,
    playNext,
    playPrevious,
    setPlaying,
    tooglePlay,
    toogleLoop,
    toogleShuffe,
    clearPlayerState,
  } = usePlayer();

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function handleEnded() {
    if (hasNext) {
      playNext();
    } else {
      clearPlayerState();
    }
  }

  function setProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener("timeupdate", (_evt) => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const episode = episodeList[currentEpisodeIndex];

  return (
    <div className={styles.container}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>
      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}
      <footer className={!episode ? styles.empty : ""}>
        <div className={styles.progress}>
          <span>{convertDuration(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: "#04d361" }}
                railStyle={{ backgroundColor: "#9f75ff" }}
                handleStyle={{ borderColor: "#04d361", borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider}></div>
            )}
          </div>
          <span>{convertDuration(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            onPlay={() => setPlaying(true)}
            onEnded={handleEnded}
            onLoadedMetadata={setProgressListener}
            loop={isLooping}
            autoPlay
          ></audio>
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            onClick={toogleShuffe}
            disabled={!episode || episodeList.length === 1}
            className={isShuffe ? styles.isActive : ""}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button
            type="button"
            disabled={!episode || !hasPrevious}
            onClick={playPrevious}
          >
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={tooglePlay}
          >
            {isPlaying ? (
              <img src="/pause.svg" alt="Pausar" />
            ) : (
              <img src="/play.svg" alt="Tocar" />
            )}
          </button>
          <button
            type="button"
            disabled={!episode || !hasNext}
            onClick={playNext}
          >
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>
          <button
            type="button"
            onClick={toogleLoop}
            disabled={!episode}
            className={isLooping ? styles.isActive : ""}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
