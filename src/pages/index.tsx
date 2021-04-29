import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import { useContext } from "react";
import { GetStaticProps } from "next";
import Image from "next/image";

import { api } from "../services/api";
import { convertDuration } from "../utils/date";
import { PlayerContext } from "../contexts/PlayerContext";

import styles from "./home.module.scss";

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  url: string;
  duration: number;
  durationAsString: string;
  publishedAt: Date;
};

type HomeProps = {
  allEpisodes: Episode[];
  firstEpisodes: Episode[];
};

export default function Home({ allEpisodes, firstEpisodes }: HomeProps) {
  const player = useContext(PlayerContext);

  return (
    <div className={styles.homepage}>
      <section className={styles.firstEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {firstEpisodes.map((e) => {
            return (
              <li key={e.id}>
                <div style={{ width: 100 }}>
                  <Image
                    src={e.thumbnail}
                    alt={e.title}
                    width={192}
                    height={192}
                    objectFit="cover"
                  />
                </div>
                <div className={styles.episodeDetails}>
                  <a href={`/episodes/${e.id}`}>{e.title}</a>
                  <p>{e.members}</p>
                  <span>{e.publishedAt}</span>
                  <span>{e.durationAsString}</span>
                  <span></span>
                </div>
                <button type="button" onClick={() => player.play(e)}>
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <th></th>
            <th>Podcast</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th>Duração</th>
            <th></th>
          </thead>
          <tbody>
            {allEpisodes.map((e) => {
              return (
                <tr key={e.id}>
                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      src={e.thumbnail}
                      alt={e.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <a href={`/episodes/${e.id}`}>{e.title}</a>
                  </td>
                  <td>{e.members}</td>
                  <td style={{ width: 100 }}>{e.publishedAt}</td>
                  <td>{e.durationAsString}</td>
                  <td>
                    <button type="button" onClick={() => player.play(e)}>
                      <img src="play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get(`/episodes`, {
    params: {
      _limit: 12,
      _sort: "published_at",
      _oder: "desc",
    },
  });

  const episodes = data.map((d) => {
    // transformar dados aqui, server side, não no render side
    return {
      id: d.id,
      title: d.title,
      thumbnail: d.thumbnail,
      members: d.members,
      publishedAt: format(parseISO(d.published_at), "d MMM yy", {
        locale: ptBR,
      }),
      url: d.file.url,
      duration: Number(d.file.duration),
      durationAsString: convertDuration(d.file.duration),
    };
  });

  const firstEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      allEpisodes,
      firstEpisodes,
    },
    revalidate: 24 * 60 * 60, //{em segs} : recalc Todo dia
  };
};
