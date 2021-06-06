import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '../../services/api';
import EpisodeFactory from '../../utils/factories/EpisodeFactory';
import { Episode } from '../../models/Episode';
import styles from '../../styles/episodes.module.scss';

interface EpisodeProps {
    episode: Episode
}

export default function EpisodePage({ episode }: EpisodeProps) {


    return (
        <div className={styles.container}>
            <div className={styles.episode}>
                <Head>
                    <title>{episode.title} | Podcastr</title>
                </Head>

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
                    <button type="button">
                        <img src="/play.svg" alt="Tocar episódio" />
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
                />
            </div>
        </div>
    )
}
//Para ser possivel pegar os parametros da rota em um pagina estatica
//Doc: https://nextjs.org/docs/basic-features/data-fetching#getstaticpaths-static-generation
export const getStaticPaths: GetStaticPaths = async () => {
    const paths = []

    return {
        paths,
        fallback: 'blocking'
    }
}

//Gera uma versao estatica da page, atualizada periodicamente.
//Isso melhora muito a performance e util para pages que demoram para mudar
//Evitando requisicoes desnecessarias
//Doc: https://nextjs.org/docs/basic-features/pages#static-generation-recommended
export const getStaticProps: GetStaticProps = async (context) => {

    const { id } = context.params;

    const { data } = await api.get(`episodes/${id}`);
    const episode = EpisodeFactory(
        data.id,
        data.title,
        data.members,
        data.thumbnail,
        data.published_at,
        data.file.duration,
        data.file.url,
        data.description
    )

    return {
        props: {
            episode
        },
        //Aqui coloco de o periodo em que ocorre a atualizacao da pages
        revalidate: 60 * 60 * 24, //24 horas
    }

}