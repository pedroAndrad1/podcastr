//Carregado sempre que ha mudanca de rota
import '../styles/global.scss';
import styles from '../styles/app.module.scss';
import Header from '../components/Header';
import Player from '../components/Player';
import { PlayerContextProvider } from '../contexts/PlayerContext';
import { ThemeProvider } from 'next-themes'

function MyApp({ Component, pageProps }) {

  return (
    <ThemeProvider defaultTheme="system">
      <PlayerContextProvider>
        <div className={styles.wrapper}>
          <main>
            <Header />
            <Component {...pageProps} />
          </main>
          <Player />
        </div>
      </PlayerContextProvider>
    </ThemeProvider>
  )
}

export default MyApp
