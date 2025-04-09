import { FileObject, StorageError } from '@supabase/storage-js';
import { BucketFolderNamesEnum } from '../../enums/bucket-folder-names';

export interface RemoveFileParams {
  folder: BucketFolderNamesEnum;
  fileName: string;
}

export interface UploadFileParams {
  folder: BucketFolderNamesEnum;
  fileName: string;
  file: File;
}

export interface DownloadFilesParams {
  folder: BucketFolderNamesEnum;
}

export interface DownloadFilesResponse {
  data: FileObject[] | null;
  error: StorageError | null;
}

export interface UploadFilesResponse {
  data: { id: string; path: string; fullPath: string } | null;
  error: StorageError | null;
}
