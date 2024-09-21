import { Component, NgZone, OnInit } from '@angular/core';
import { SendIntent } from 'send-intent';
import { SendIntentPlugin } from 'send-intent';
import { DeepLinkService } from './modules/deep-link.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { DownloadAudioService } from './modules/download-audio.service';
import { DatabaseService } from './modules/database.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  result: string = '';

  constructor(
    private zone: NgZone,
    private deepLink: DeepLinkService,
    private audioService: DownloadAudioService,
    private dbService: DatabaseService
  ) {}


  async ngOnInit() {
    await this.dbService.initializeDB();

    this.checkIntent();

    setTimeout(() => {
      console.log('Splash Screen Hidden');
      SplashScreen.hide();
    }, 1000);

    window.addEventListener('sendIntentReceived', () => {
      this.zone.run(async () => {
        this.checkIntent();
      });
    });
  }

  async checkIntent() {
    try {
      const result: any = await SendIntent.checkSendIntentReceived();
      if (result) {
        let res = JSON.stringify(result);
        console.log(res);
        this.result = res;

        this.audioService.saveAudioToDB(result.url);        

        // this.deepLink.launchApp('com.thirumalai.otic');
        // SendIntent.finish();
      }
    } catch (error) {
      console.error(error);
    }
  }
}
