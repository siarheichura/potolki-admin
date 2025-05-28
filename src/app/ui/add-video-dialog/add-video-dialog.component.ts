import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbDialogRef, NbInputModule } from '@nebular/theme';

@Component({
  selector: 'psa-add-video-dialog',
  imports: [NbCardModule, NbButtonModule, NbInputModule, ReactiveFormsModule],
  templateUrl: './add-video-dialog.component.html',
  styleUrl: './add-video-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddVideoDialogComponent {
  #dialogRef = inject(NbDialogRef);

  videoLinkControl = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  handleSubmit() {
    if (this.videoLinkControl.invalid) return;

    const videoId = this.getVideoId(this.videoLinkControl.value);

    this.#dialogRef.close(videoId);
  }

  getVideoId(url: string): string | null {
    const regex =
      /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    const match = url.match(regex);

    return match ? match[1] : null;
  }
}
