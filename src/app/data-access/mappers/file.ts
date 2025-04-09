import { Injectable } from '@angular/core';
import { FileObject } from '@supabase/storage-js';
import { environment } from '../../app.config';
import { BucketFolderNamesEnum } from '../enums/bucket-folder-names';
import { FileModel } from '../models/file';

@Injectable({ providedIn: 'root' })
export class FileMapper {
  map(model: FileObject, bucketFolder: BucketFolderNamesEnum): FileModel {
    return {
      name: model.name,
      id: model.id,
      size: model.metadata['size'],
      mimetype: model.metadata['mimetype'],
      url: `${environment.supabaseUrl}/storage/v1/object/public/${environment.subabaseBucketName}/${bucketFolder}/${model.name}`,
    };
  }
}
