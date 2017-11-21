import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SwimlaneData} from '../../../../../view-model/board/swimlane-data';
import {BoardViewModel} from '../../../../../view-model/board/board-view';

@Component({
  selector: 'app-kanban-swimlane-entry',
  templateUrl: './kanban-swimlane-entry.component.html',
  styleUrls: ['./kanban-swimlane-entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KanbanSwimlaneEntryComponent implements OnInit, OnChanges {

  @Input()
  board: BoardViewModel

  @Input()
  showEmpty: boolean;

  @Input()
  swimlane: SwimlaneData;

  visible: boolean;


  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.visible = true;
    if (!this.swimlane.filterVisible) {
      this.visible = false;
    } else if (!this.showEmpty && this.swimlane.visibleIssues === 0) {
      this.visible = false;
    }
  }

// trackBy is a hint to angular to be able to keep (i.e. don't destroy and recreate) as many components as possible
  columnTrackByFn(index: number, key: string) {
    return index;
  }
}
