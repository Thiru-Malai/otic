import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-audio-card',
  templateUrl: './audio-card.component.html',
  styleUrls: ['./audio-card.component.scss'],
})
export class AudioCardComponent {
  @Input() audio: any = {};
  playing: boolean = false;
  constructor() {}

}
