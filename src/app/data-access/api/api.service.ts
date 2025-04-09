import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { from, Observable } from 'rxjs';
import { environment } from '../../app.config';
import {
  DownloadFilesParams,
  DownloadFilesResponse,
  RemoveFileParams,
  UploadFileParams,
  UploadFilesResponse,
} from './models/rest-models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  #supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

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
