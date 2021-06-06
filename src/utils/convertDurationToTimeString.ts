export default function convertDurationToTimeString(duration: number){
    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor(hours / 60);
    const seconds = duration % 60;
    
    //Caso um dos itens nao tenha dois numeros, ira adicionar um 0 a esquerda. Ex: 1 => 01
    const timeString = [hours, minutes, seconds]
      .map(unit => String(unit).padStart(2, '0'))
      //No final, faz um join para hours:minutes:seconds
      .join(':')
    
    return timeString;
  }
  
  