import Image from 'next/image';
import { useRef, useEffect, useState, useContext } from 'react';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';


import styles from './styles.module.scss';
import { usePlayer } from '../../contexts/PlayerContext';
import convertDurationToTimeString from '../../utils/convertDurationToTimeString';

export default function Player() {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [progress, setProgress] = useState(0);
    const { episodeList,
        isPlaying,
        currentEpisodeIndex,
        setPlayingState,
        isLooping,
        toggleLoop,
        toggleShuffle,
        isShuffling,
        hasPrevious,
        hasNext,
        playPrevious,
        playNext,
        togglePlay,
        clearPlayerState
    } = usePlayer();
    const episode = episodeList[currentEpisodeIndex];

    //Para manipular o player se ele pausar ou der play
    useEffect(() => {
        //Se o elemento de audio nao estiver carregado, fazer nada
        if (!audioRef.current) return;

        isPlaying ? audioRef.current.play() : audioRef.current.pause();

    }, [isPlaying]);

    const progressListener = () =>{
        //Zerando o timer do audio
        audioRef.current.currentTime = 0;

        //Atualizando o valor de progress a cada instante
        audioRef.current.addEventListener('timeupdate', () =>{
            //audioRef.current.currentTime retorna um numero real, por isso o floor
            setProgress(Math.floor(audioRef.current.currentTime));
        })
    }

    const handleDrag = (amount: number) => {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    const handleEpisodeEnd = () =>{
        hasNext? playNext() : clearPlayerState //Caso nao tenha mais eps, limpar a lista
    }

    return (
        <aside className={styles.playerContainer}>
            <header>
                <img src='/playing.svg' alt='icone de tocando' />
                <strong>Tocando agora</strong>
            </header>
            { episode ? (
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
            <footer className={styles.empty}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                                max={episode.duration}
                                onChange={handleDrag}
                                value={progress}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                    </div>
                    {/**?? para caso nao tiver episode, ai o parametro deve ser 0 */}
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                {episode && (
                    <audio
                        src={episode.url}
                        autoPlay
                        ref={audioRef}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        loop={isLooping}
                        //É disparado quando os dados de audio sao carregados
                        onLoadedMetadata={progressListener}
                        onEnded={handleEpisodeEnd}
                    />
                )}
                <div className={styles.controlButtons}>
                    <button
                        type="button"
                        disabled={!episode || episodeList.length === 1}
                        onClick={toggleShuffle}
                        className={isShuffling ? styles.isActive : ''}
                    >
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>
                    <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
                        <img src="/play-previous.svg" alt="Tocar anterior" />
                    </button>
                    <button
                        type="button"
                        className={styles.playButton}
                        disabled={!episode}
                        onClick={togglePlay}
                    >
                        {isPlaying
                            ? <img src="/pause.svg" alt="Tocar" />
                            : <img src="/play.svg" alt="Tocar" />}
                    </button>
                    <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Tocar próxima" />
                    </button>
                    <button
                        type="button"
                        disabled={!episode}
                        onClick={toggleLoop}
                        className={isLooping ? styles.isActive : ''}
                    >
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>
        </aside>
    )
}