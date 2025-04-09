import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { ApiService } from '../api/api.service';
import { BucketFolderNamesEnum } from '../enums/bucket-folder-names';
import { FileMapper } from '../mappers/file';
import { FileModel } from '../models/file';

interface AppState {
  reviewsFiles: FileModel[];
  worksFiles: FileModel[];
  isLoading: boolean;
  error: string | null;
}

export const AppStore = signalStore(
  { providedIn: 'root' },

  withState<AppState>({
    reviewsFiles: [],
    worksFiles: [],
    isLoading: false,
    error: null,
  }),

  withMethods((store, api = inject(ApiService), fileMapper = inject(FileMapper)) => {
    const downloadWorksFiles = rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() =>
          api.downloadFiles({ folder: BucketFolderNamesEnum.Works }).pipe(
            tapResponse({
              next: (res) =>
                patchState(store, {
                  worksFiles: res.data?.map((i) => fileMapper.map(i, BucketFolderNamesEnum.Works)),
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

    return {
      downloadWorksFiles,
      removeWorksFile,
      uploadWorksFile,
      downloadReviewsFiles,
      removeReviewsFile,
      uploadReviewsFile,
    };
  }),
);
