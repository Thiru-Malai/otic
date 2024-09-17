import { Injectable } from '@angular/core';
import { AppLauncher } from '@capacitor/app-launcher';

@Injectable({
  providedIn: 'root'
})
export class DeepLinkService {

  constructor() { }

  async launchApp(url: string) {
    try {
      await AppLauncher.openUrl({url: url});
    } catch (error) {
      console.error(error);
    }
  }
}
