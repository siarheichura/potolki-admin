import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  TemplateRef,
  viewChild,
} from '@angular/core';
import {
  NbAccordionModule,
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbDialogService,
  NbLayoutModule,
  NbListModule,
  NbUserModule,
} from '@nebular/theme';
import { BucketFolderNamesEnum } from './data-access/enums/bucket-folder-names';
import { FileModel } from './data-access/models/file';
import { AppStore } from './data-access/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NbLayoutModule,
    NbAccordionModule,
    NbListModule,
    NbUserModule,
    NbActionsModule,
    NbCardModule,
    NbButtonModule,
  ],
})
export class AppComponent implements OnInit {
  readonly BucketFolderNamesEnum = BucketFolderNamesEnum;

  #store = inject(AppStore);
  #dialogService = inject(NbDialogService);

  worksFiles = computed(() => this.#store.worksFiles());
  reviewsFiles = computed(() => this.#store.reviewsFiles());

  worksUploader = viewChild<ElementRef<HTMLInputElement>>('worksUploader');
  reviewsUploader = viewChild<ElementRef<HTMLInputElement>>('reviewsUploader');

  ngOnInit() {
    this.#store.downloadWorksFiles();
    this.#store.downloadReviewsFiles();
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleFileClick(file: FileModel, dialog: TemplateRef<any>) {
    this.#dialogService.open(dialog, { context: file.url });
  }
}
