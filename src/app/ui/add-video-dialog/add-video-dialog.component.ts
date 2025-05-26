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

    this.#dialogRef.close(this.videoLinkControl.value);
  }
}
