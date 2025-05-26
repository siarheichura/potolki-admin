import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';
import { NbActionsModule, NbCardModule } from '@nebular/theme';

@Component({
  selector: 'psa-youtube-item-card',
  imports: [NbActionsModule, NbCardModule, YouTubePlayer],
  templateUrl: './youtube-item-card.component.html',
  styleUrl: './youtube-item-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YoutubeItemCardComponent {
  id = input.required<string>();

  delete = output<string>();
}
