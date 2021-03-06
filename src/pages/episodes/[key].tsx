import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import ptBR from "date-fns/locale/pt-BR";

import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";

import { api } from "../../services/api";
import { convertDuration } from "../../utils/date";

import styles from "./episode.module.scss";
import { usePlayer } from "../../contexts/PlayerContext";
import { useState } from "react";

type Episode = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  members: string;
  url: string;
  duration: number;
  durationAsString: string;
  publishedAt: Date;
};

type EpisodeProps = {
  episode: Episode;
};

export default function Episode({ episode }: EpisodeProps) {
  const { isPlaying, play, tooglePlay } = usePlayer();
  const [alreadyPlay, setAlreadyPlay] = useState(false);

  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <button
          type="button"
          onClick={() => {
            if (alreadyPlay && isPlaying) {
              tooglePlay();
            } else {
              play(episode);
              setAlreadyPlay(true);
            }
          }}
        >
          {alreadyPlay && isPlaying ? (
            <img src="/pause.svg" alt="Pausar episódio" />
          ) : (
            <img src="/play.svg" alt="Tocar episódio" />
          )}
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>
      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: episode.description }}
      ></div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { key } = params;
  const { data } = await api.get(`/episodes/${key}`);

  return {
    props: {
      episode: {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), "d MMM yy", {
          locale: ptBR,
        }),
        url: data.file.url,
        duration: Number(data.file.duration),
        durationAsString: convertDuration(data.file.duration),
        description: data.description,
      },
    },
    revalidate: 60 * 60 * 24,
  };
};
