import { Injectable, signal, WritableSignal } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { AUDIO } from '../modals/audio';

const AUDIO_DB = "audios"

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private audios: WritableSignal<AUDIO[]> = signal<AUDIO[]>([]); 

  constructor() { }

  async initializeDB(){
    this.db = await this.sqlite.createConnection(
      AUDIO_DB,
      false,
      'no-encryption',
      1,
      false
    )
    
    await this.db.open();

    const schema = `CREATE TABLE IF NOT EXISTS audios (
      id TEXT NOT NULL,
      title TEXT NOT NULL,
      duration TEXT NOT NULL,
      thumbnail_url TEXT NOT NULL,
      audio_data TEXT NOT NULL
    );`;
  
    await this.db.execute(schema);
    this.loadAudios();
    console.log('DB Initialized')
    return true;
  }

  async loadAudios(){
    const audios = await this.db.query('SELECT * from audios')
    this.audios.set(audios.values || []);
    console.log(this.audios())
  }

  async addAudio(audio: AUDIO){
    const query = `INSERT INTO audios (id, title, duration, thumbnail_url, audio_data) VALUES ("${audio.id}","${audio.title}","${audio.duration}","${audio.thumbnail_url}","${audio.audio}");`;
    const result =  await this.db.query(query);
    
    this.loadAudios();

    return result;
  }

  getAudios(){
    return this.audios();
  }

}
