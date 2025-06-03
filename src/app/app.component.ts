import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbDialogService,
  NbLayoutModule,
  NbListModule,
  NbTabsetModule,
  NbUserModule,
} from '@nebular/theme';
import { BucketFolderNamesEnum } from './data-access/enums/bucket-folder-names';
import { AppStore } from './data-access/store';
import { AddVideoDialogComponent } from './ui/add-video-dialog/add-video-dialog.component';
import { ImgItemCardComponent } from './ui/img-item-card/img-item-card.component';
import { YoutubeItemCardComponent } from './ui/youtube-item-card/youtube-item-card.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NbLayoutModule,
    NbListModule,
    NbUserModule,
    NbActionsModule,
    NbCardModule,
    NbTabsetModule,
    NbButtonModule,
    ImgItemCardComponent,
    YoutubeItemCardComponent,
  ],
})
export class AppComponent implements OnInit {
  readonly BucketFolderNamesEnum = BucketFolderNamesEnum;

  #store = inject(AppStore);
  #dialogService = inject(NbDialogService);

  worksFiles = computed(() => this.#store.worksFiles());
  worksYoutubeVideos = computed(() => this.#store.youtubeVideos());
  reviewsFiles = computed(() => this.#store.reviewsFiles());

  worksUploader = viewChild<ElementRef<HTMLInputElement>>('worksUploader');
  reviewsUploader = viewChild<ElementRef<HTMLInputElement>>('reviewsUploader');

  ngOnInit() {
    this.#store.downloadWorksFiles();
    this.#store.downloadReviewsFiles();
    this.#store.getWorksYoutubeVideo();
  }

  handleRemoveWorksFile(fileName: string) {
    this.#store.removeWorksFile({ fileName });
  }

  handleRemoveReviewsFile(fileName: string) {
    this.#store.removeReviewsFile({ fileName });
  }

  handleWorksUploadFileClick(event: Event) {
    event.stopPropagation();
    this.worksUploader()?.nativeElement?.click();
  }

  handleReviewsUploadFileClick(event: Event) {
    event.stopPropagation();
    this.reviewsUploader()?.nativeElement?.click();
  }

  handleFileInputChange(event: Event, folder: BucketFolderNamesEnum) {
    const files = Array.from((event.target as HTMLInputElement).files || []);

    if (folder === BucketFolderNamesEnum.Works) {
      files.forEach((file) =>
        this.#store.uploadWorksFile({ file, fileName: Date.now().toString() }),
      );
    } else if (folder === BucketFolderNamesEnum.Reviews) {
      files.forEach((file) =>
        this.#store.uploadReviewsFile({ file, fileName: Date.now().toString() }),
      );
    }
  }

  handleWorksAddVideoClick(event: Event) {
    event.stopPropagation();

    this.#dialogService.open(AddVideoDialogComponent).onClose.subscribe((id: string) => {
      this.handleWorksAddVideo(id);
    });
  }

  handleWorksRemoveVideo(id: string) {
    this.#store.removeWorksYoutubeVideo(id);
  }

  handleWorksAddVideo(id: string) {
    this.#store.addWorksYoutubeVideo(id);
  }
}
