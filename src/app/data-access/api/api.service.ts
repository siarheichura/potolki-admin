import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { from, map, Observable } from 'rxjs';
import { environment } from '../../app.config';
import {
  DownloadFilesParams,
  DownloadFilesResponse,
  RemoveFileParams,
  UploadFileParams,
  UploadFilesResponse,
  YoutubeVideoRestModel,
} from './models/rest-models';
import { Database } from './models/supabase';

// eslint-disable-next-line no-console
console.log('______ENVIRONMENT______', environment);

@Injectable({ providedIn: 'root' })
export class ApiService {
  #supabase = createClient<Database>(environment.supabaseUrl, environment.supabaseKey);

  /*** Youtube videos ***/

  getYoutubeVideos(): Observable<YoutubeVideoRestModel[]> {
    const promise = this.#supabase.from('youtube').select('*');

    return from(promise).pipe(map((res) => res.data ?? []));
  }

  addYoutubeVideo(id: string): Observable<YoutubeVideoRestModel> {
    const itemToInsert = { youtubeId: id };

    const promise = this.#supabase.from('youtube').insert(itemToInsert).select('*').single();

    return from(promise).pipe(map((res) => res.data!));
  }

  removeYoutubeVideo(id: string): Observable<void> {
    const promise = this.#supabase.from('youtube').delete().match({ youtubeId: id });

    return from(promise).pipe(map((res) => res.data!));
  }

  /*** Files ***/

  downloadFiles(params: DownloadFilesParams): Observable<DownloadFilesResponse> {
    return from(this.#supabase.storage.from(environment.subabaseBucketName).list(params.folder));
  }

  uploadFile(params: UploadFileParams): Observable<UploadFilesResponse> {
    return from(
      this.#supabase.storage
        .from(environment.subabaseBucketName)
        .upload(`${params.folder}/${params.fileName}`, params.file),
    );
  }

  removeFile(params: RemoveFileParams): Observable<DownloadFilesResponse> {
    return from(
      this.#supabase.storage
        .from(environment.subabaseBucketName)
        .remove([`${params.folder}/${params.fileName}`]),
    );
  }
}
