import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class DownloadAudioService {

  constructor(private http: HttpClient) { }

  async saveAudioToDB(url: string): Promise<any> {    
    try{
      const res = await firstValueFrom(this.http.post(environment.api + '/download?url=' + url, ''))
      return res
    }
    catch(err: any){
      console.log(err)
      if(err.error.error){
       return err.error.error
      }
      return 'Please Try Again.'
    }
  }

  async getAudioFromDB(id: string): Promise<any> {
    try{
      const res = await firstValueFrom(this.http.get(environment.api + '/download?id=' + id))
      return res
    }
    catch(err){
      return 'Please Try Again.'
    }
  }
}

