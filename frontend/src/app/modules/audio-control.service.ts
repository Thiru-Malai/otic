import { Injectable } from '@angular/core';
import { Filesystem, FilesystemDirectory } from '@capacitor/filesystem';
import { AUDIO } from '../modals/audio';
import { Subject } from 'rxjs';

declare var window: any;

@Injectable({
  providedIn: 'root'
})
export class AudioControlService {
  audioPlayer?: HTMLAudioElement;
  audioFile: any;
  _isPlaying: Subject<any> = new Subject<any>();
  constructor() { }

  private audioFinished(){
    this.audioPlayer?.addEventListener("ended", ()=>{
      console.log('Ended')
      this.audioPlayer!.currentTime = 0;
      this._isPlaying.next({id: null, state: 'pause'});
    })
  }

  private async audioExistsInLocal(audio: AUDIO): Promise<Boolean>{
    const fileStat: any = await Filesystem.stat({
      path: audio.id,
      directory: FilesystemDirectory.External
    }).catch((err) => {
      console.log(err)
      return Promise.resolve(false);
    })
    if(fileStat){
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  private async createAudioInLocal(audio: AUDIO): Promise<Boolean>{
    this.audioFile = await Filesystem.writeFile({
      path: audio.id,
      data: `data:${audio.id}/mpeg;base64,` + audio.audio,
      directory: FilesystemDirectory.External
    }).catch((err) => {
      console.log(err)
      throw new err;
    })
    return Promise.resolve(true);
  }

  async playAudio(audio: AUDIO){

    const isAudioPlaying = this.isPlaying()

    if(isAudioPlaying){
      this.pauseAudio(audio.id);
      this.audioPlayer = undefined;
    }

    this.audioExistsInLocal(audio)
    .then((audioExists) => {
      console.log(audioExists)
      return Promise.resolve(audioExists);
    })
    .then((audioExists) => {
      if(!audioExists){
        console.log(audioExists)
        return this.createAudioInLocal(audio)
      }
      return Promise.resolve(false);  // audio already exists
    })
    .then(async (audioFileCreated) => {
      if(audioFileCreated){
        console.log("Playing new audio: ", audioFileCreated)
        this.audioPlayer = new Audio(window.Ionic.WebView.convertFileSrc(this.audioFile.uri));
        await this.audioPlayer.play();
        this.audioFinished();
      }
      else{
        console.log("Playing existing audio: ", audioFileCreated)
        await this.audioPlayer?.play();
      }
      this._isPlaying.next({id: audio.id, state: 'play'})
    })
    .catch((err) => {
      console.log(err)
    })
  }

  private isPlaying(){
    return !this.audioPlayer?.paused;
  }

  pauseAudio(id: string){
    this.audioPlayer?.pause();
    this._isPlaying.next({id: id, state: 'pause'})
  }
}
