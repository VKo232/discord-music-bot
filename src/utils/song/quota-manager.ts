import { Config } from "../../config";
import { google, youtube_v3 } from "googleapis";

const LIMIT = 10000;

export class YoutubeQuotaManager {
  private count = 0;
  private apikeys = [
    Config.GOOGLE_API_KEY,
    Config.GOOGLE_API_KEY1,
    Config.GOOGLE_API_KEY2,
  ];
  private youtubeinstances: youtube_v3.Youtube[] = [];
  private index = 0;

  constructor() {
    for (const key of this.apikeys) {
      console.log(key);
      const youtube = google.youtube({
        version: "v3",
        auth: Config.GOOGLE_API_KEY,
      });
      this.youtubeinstances.push(youtube);
    }
  }

  private getInstance(usage:number) {
    this.count += usage;
    if(this.count > LIMIT) {
        this.index++;
        if(this.index >= this.youtubeinstances.length ) this.index =0;
        this.count = usage;
    }
    return this.youtubeinstances[this.index];
  }
  public search() {
    return this.getInstance(100).search;
  }
  public videos() {
    return this.getInstance(1).videos;

  }
  public playlistItems() {
    return this.getInstance(1).playlistItems;
  }
}
