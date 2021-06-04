import Head from 'next/head';

export default function Home({ episodes }) {
  return (
    <>
      <h1>
        INDEX
      </h1>
      <p>{JSON.stringify(episodes)}</p>
    </>
  )
}

//Gera uma versao estatica da page, atualizadad periodicamente.
//Isso melhora muito a performance e util para pages que demoram para mudar
//Evitando requisicoes desnecessarias
//Doc: https://nextjs.org/docs/basic-features/pages#static-generation-recommended
export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes');
  const data = await response.json();

  return {
    props: {
      episodes: data,
    },
    //Aqui coloco de o periodo em que ocorre a atualizacao da pages
    revalidate: 60 * 60 * 8, 
  }

}