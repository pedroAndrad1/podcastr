import Head from 'next/head';
import { GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { api } from '../services/api';

import { Episode } from '../models/Episode';
import EpisodeFactory from '../utils/factories/EpisodeFactory';
import styles from '../styles/home.module.scss';
import { useContext } from 'react';
import { PlayerContext, usePlayer } from '../contexts/PlayerContext';

interface HomeProps {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

//IMPLEMENTAR UM INFINITE SCROLL OU PAGINACAO MAIS TARDE
export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {

  const { playList } = usePlayer();
  //Concatenando todos os eps em um lista, usarei issa para passar para function playList
  const episodesList = [...latestEpisodes, ...allEpisodes];

  return (
    <div className={styles.homeContainer}>
      <Head>
          <title>Home | podcastr</title>
      </Head>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {
            latestEpisodes.map((episode, index) => {
              return (
                <li key={episode.id}>
                  {/**Image do next é util para otimizar imagens */}
                  <Image
                    height={192}
                    width={192}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit='cover'
                  />
                  <div className={styles.episodeDetails}>
                    <Link href={`/episodes/${episode.id}`}><a >{episode.title}</a></Link>
                    <p>{episode.members}</p>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                  </div>
                  {/**o index, nesse caso, do map bate com o index do ep no array */}
                  <button type='button' onClick={() => playList(episodesList, index)}>
                    <img src='/play-green.svg' alt='Tocar episódio' />
                  </button>
                </li>
              )
            })
          }
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => {
              return (
                <tr key={episode.id}>
                  <td>
                    <Link href={`/episodes/${episode.id}`}><a>{episode.title}</a></Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: '100px' }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    {/**o index ndo map nao bate com o index do ep no array. Pra resolver isso,
                      * irei somar com o length do array latestEpisodes, assim pulo estes eps no array
                      * episodesList
                      */}
                    <button type="button" onClick={() => playList(episodesList, index + latestEpisodes.length)}>
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}

//Gera uma versao estatica da page, atualizada periodicamente.
//Isso melhora muito a performance e util para pages que demoram para mudar
//Evitando requisicoes desnecessarias
//Doc: https://nextjs.org/docs/basic-features/pages#static-generation-recommended
export const getStaticProps: GetStaticProps = async () => {

  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  const episodes: Array<Episode> = data.map(episode => {
    return EpisodeFactory(
      episode.id,
      episode.title,
      episode.members,
      episode.thumbnail,
      episode.published_at,
      episode.file.duration,
      episode.file.url,
      episode.description
    )
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    //Aqui coloco de o periodo em que ocorre a atualizacao da pages
    revalidate: 60 * 60 * 8, //8 horas
  }

}