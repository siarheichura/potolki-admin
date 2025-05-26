import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { ApiService } from '../api/api.service';
import { BucketFolderNamesEnum } from '../enums/bucket-folder-names';
import { FileMapper } from '../mappers/file';
import { YoutubeVideoMapper } from '../mappers/youtube-video';
import { FileModel } from '../models/file';
import { YoutubeVideoModel } from '../models/youtube-video-id';

interface AppState {
  reviewsFiles: FileModel[];
  worksFiles: FileModel[];
  youtubeVideos: YoutubeVideoModel[];
  isLoading: boolean;
  error: string | null;
}

export const AppStore = signalStore(
  { providedIn: 'root' },

  withState<AppState>({
    reviewsFiles: [],
    worksFiles: [],
    youtubeVideos: [],
    isLoading: false,
    error: null,
  }),

  withMethods(
    (
      store,
      api = inject(ApiService),
      fileMapper = inject(FileMapper),
      youtubeVideoMapper = inject(YoutubeVideoMapper),
    ) => {
      const downloadWorksFiles = rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(() =>
            api.downloadFiles({ folder: BucketFolderNamesEnum.Works }).pipe(
              tapResponse({
                next: (res) =>
                  patchState(store, {
                    worksFiles: res.data?.map((i) =>
                      fileMapper.map(i, BucketFolderNamesEnum.Works),
                    ),
                  }),
                error: (error: HttpErrorResponse) => patchState(store, { error: error.message }),
                finalize: () => patchState(store, { isLoading: false }),
              }),
            ),
          ),
        ),
      );

      const removeWorksFile = rxMethod<{ fileName: string }>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((params) =>
            api.removeFile({ ...params, folder: BucketFolderNamesEnum.Works }).pipe(
              tapResponse({
                next: () => downloadWorksFiles(),
                error: (error: HttpErrorResponse) => patchState(store, { error: error.message }),
                finalize: () => patchState(store, { isLoading: false }),
              }),
            ),
          ),
        ),
      );

      const uploadWorksFile = rxMethod<{ fileName: string; file: File }>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((params) =>
            api.uploadFile({ ...params, folder: BucketFolderNamesEnum.Works }).pipe(
              tapResponse({
                next: () => downloadWorksFiles(),
                error: (error: HttpErrorResponse) => patchState(store, { error: error.message }),
                finalize: () => patchState(store, { isLoading: false }),
              }),
            ),
          ),
        ),
      );

      const downloadReviewsFiles = rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(() =>
            api.downloadFiles({ folder: BucketFolderNamesEnum.Reviews }).pipe(
              tapResponse({
                next: (res) =>
                  patchState(store, {
                    reviewsFiles: res.data?.map((i) =>
                      fileMapper.map(i, BucketFolderNamesEnum.Reviews),
                    ),
                  }),
                error: (error: HttpErrorResponse) => patchState(store, { error: error.message }),
                finalize: () => patchState(store, { isLoading: false }),
              }),
            ),
          ),
        ),
      );

      const removeReviewsFile = rxMethod<{ fileName: string }>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((params) =>
            api.removeFile({ ...params, folder: BucketFolderNamesEnum.Reviews }).pipe(
              tapResponse({
                next: () => downloadReviewsFiles(),
                error: (error: HttpErrorResponse) => patchState(store, { error: error.message }),
                finalize: () => patchState(store, { isLoading: false }),
              }),
            ),
          ),
        ),
      );

      const uploadReviewsFile = rxMethod<{ fileName: string; file: File }>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((params) =>
            api.uploadFile({ ...params, folder: BucketFolderNamesEnum.Reviews }).pipe(
              tapResponse({
                next: () => downloadReviewsFiles(),
                error: (error: HttpErrorResponse) => patchState(store, { error: error.message }),
                finalize: () => patchState(store, { isLoading: false }),
              }),
            ),
          ),
        ),
      );

      const getWorksYoutubeVideo = rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(() =>
            api.getYoutubeVideos().pipe(
              tapResponse({
                next: (res) =>
                  patchState(store, {
                    youtubeVideos: res.map((i) => youtubeVideoMapper.map(i)),
                    error: null,
                  }),
                error: (error: HttpErrorResponse) => patchState(store, { error: error.message }),
                finalize: () => patchState(store, { isLoading: false }),
              }),
            ),
          ),
        ),
      );

      const addWorksYoutubeVideo = rxMethod<string>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((id) =>
            api.addYoutubeVideo(id).pipe(
              tapResponse({
                next: (res) =>
                  patchState(store, {
                    youtubeVideos: [...store.youtubeVideos(), youtubeVideoMapper.map(res)],
                    error: null,
                  }),
                error: (error: HttpErrorResponse) => patchState(store, { error: error.message }),
                finalize: () => patchState(store, { isLoading: false }),
              }),
            ),
          ),
        ),
      );

      const removeWorksYoutubeVideo = rxMethod<string>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((id) =>
            api.removeYoutubeVideo(id).pipe(
              tapResponse({
                next: () =>
                  patchState(store, {
                    youtubeVideos: [...store.youtubeVideos().filter((i) => i.youtubeId !== id)],
                    error: null,
                  }),
                error: (error: HttpErrorResponse) => patchState(store, { error: error.message }),
                finalize: () => patchState(store, { isLoading: false }),
              }),
            ),
          ),
        ),
      );

      return {
        downloadWorksFiles,
        removeWorksFile,
        uploadWorksFile,
        downloadReviewsFiles,
        removeReviewsFile,
        uploadReviewsFile,
        getWorksYoutubeVideo,
        addWorksYoutubeVideo,
        removeWorksYoutubeVideo,
      };
    },
  ),
);
