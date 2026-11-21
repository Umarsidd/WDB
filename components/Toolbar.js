'use client';
import { FastForward, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
export function Toolbar({tour,setTour,speed,setSpeed,sound,toggleSound,replay,skip,live}){
  return <div className="swarm-toolbar" role="group" aria-label="Swarm animation controls">
    <button type="button" aria-pressed={tour} onClick={()=>setTour(!tour)}>{tour?<Pause size={14}/>:<Play size={14}/>} <span>Tour</span></button>
    <div aria-label="Animation speed">{[1,2,3].map(n=><button type="button" key={n} aria-label={n+' times speed'} aria-pressed={speed===n} onClick={()=>setSpeed(n)}>{n}×</button>)}</div>
    <button type="button" onClick={toggleSound} aria-pressed={sound} title={sound?'Mute sound (M)':'Tap for sound (M)'}>{sound?<Volume2 size={15}/>:<VolumeX size={15}/>}<span>{sound?'Sound on':'Tap for sound'}</span></button>
    <button type="button" onClick={replay} title="Replay" aria-label="Replay"><RotateCcw size={15}/></button>
    <button type="button" onClick={skip} className="swarm-skip"><FastForward size={14}/>{live?'Go live':'Skip intro'}</button>
  </div>;
}
