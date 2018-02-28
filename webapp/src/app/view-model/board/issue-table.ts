import {List, Map} from 'immutable';
import {BoardIssueView} from './board-issue-view';
import {SwimlaneInfo} from './swimlane-info';
import {BoardViewMode} from '../../model/board/user/board-view-mode';
import {RankViewEntry} from './rank-view-entry';

export interface IssueTable {
  issues: Map<string, BoardIssueView>;
  rankView: List<RankViewEntry>;
  _old_table: List<List<string>>;
  table: List<List<BoardIssueView>>;
  swimlaneInfo: SwimlaneInfo;
}
