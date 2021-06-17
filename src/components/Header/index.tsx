import styles from './styles.module.scss';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';


export default function Header() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const currentDate = format(new Date(), 'EEEEEE, d MMMM', { locale: ptBR });

    // Como nao da pra saber o tema no server, e preciso garantir que o cliente esteja montado
    // com a info theme para poder mostrar a UI.
    // Fonte: https://github.com/pacocoursey/next-themes#avoid-hydration-mismatch
    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return (
        <header className={styles.headerContainer}>
            <img src='/logo.svg' alt='podcastr logo' />
            <p>O melhor para você ouvir, sempre</p>
            <span>{currentDate}</span>
            {
                theme == 'dark' ?
                    <img onClick={() => setTheme('light')} src='/light-mode.png'
                        alt='Modo claro' className={styles.themeIcon} />
                    :
                    <img onClick={() => setTheme('dark')} src='/night-mode.png'
                        alt='Modo escuro' className={styles.themeIcon} />
            }
        </header>
    )
}