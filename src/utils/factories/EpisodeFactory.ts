import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR'
import convertDurationToTimeString from '../convertDurationToTimeString';

export default function EpisodeFactory(
    id: string,
    title: string,
    members: string,
    thumbnail: string,
    published_at: string,
    duration: number,
    url: string,
    description: string
){
    return{
        id : id,
        title : title,
        thumbnail : thumbnail,
        members : members,
        publishedAt : format(parseISO(published_at), 'd MMM yy', { locale: ptBR }),
        duration : Number(duration),
        durationAsString : convertDurationToTimeString(Number(duration)),
        url : url,
        description: description
    }
}