import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Downloader } from 'ytdl-mp3';

@Injectable({
  providedIn: 'root'
})

export class DownloadAudioService {

  constructor(private http: HttpClient) { }

  downloadAudio(url: string){
    this.http.get('http://localhost:3000/download?url=' + url).subscribe((res) => {
      console.log(res);
    })
  }
}

