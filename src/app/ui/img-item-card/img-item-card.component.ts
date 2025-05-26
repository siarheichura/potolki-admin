import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NbActionsModule, NbCardModule } from '@nebular/theme';
import { FileModel } from '../../data-access/models/file';

@Component({
  selector: 'psa-img-item-card',
  imports: [NbActionsModule, NbCardModule, NgOptimizedImage],
  templateUrl: './img-item-card.component.html',
  styleUrl: './img-item-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImgItemCardComponent {
  img = input.required<FileModel>();

  delete = output<string>();
}
