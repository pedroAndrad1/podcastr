import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';

//import { usePlayer } from '../../contexts/PlayerContext';

import styles from './styles.module.scss';
import convertDurationToTimeString from '../../utils/convertDurationToTimeString';

export default function Player() {
    const audioRef = useRef<HTMLAudioElement>(null)
    const episode = null;
    const isPlaying = null;

    //Para manipular o player se ele pausar ou der play
    useEffect(() =>{
        //Se o elemento de audio nao estiver carregado, fazer nada
        if(!audioRef.current) return;

        isPlaying? audioRef.current.play() : audioRef.current.pause();

    }, [isPlaying])

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
                    <span>00:00</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                    </div>
                    <span>00:00</span>
                </div>

                {episode && (
                    <audio
                        src={episode.url}
                        autoPlay
                        ref={audioRef}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                    />
                )}
                <div className={styles.controlButtons}>
                    <button type='button' disabled={!episode}>
                        <img src='/shuffle.svg' alt='Embaralhar' />
                    </button>
                    <button type='button' disabled={!episode}>
                        <img src='/play-previous.svg' alt='Tocar anterior' />
                    </button>
                    <button type='button' className={styles.playButton} disabled={!episode}>
                        <img src='/play.svg' alt='Tocar' />
                    </button>
                    <button type='button' disabled={!episode}>
                        <img src='/play-next.svg' alt='Tocar próxima' />
                    </button>
                    <button type='button' disabled={!episode}>
                        <img src='/repeat.svg' alt='Repetir' />
                    </button>
                </div>
            </footer>
        </aside>
    )
}