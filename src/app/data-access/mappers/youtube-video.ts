import { Injectable } from '@angular/core';
import { YoutubeVideoRestModel } from '../api/models/rest-models';
import { YoutubeVideoModel } from '../models/youtube-video-id';

@Injectable({ providedIn: 'root' })
export class YoutubeVideoMapper {
  map(model: YoutubeVideoRestModel): YoutubeVideoModel {
    return {
      youtubeId: model.youtubeId,
    };
  }
}
