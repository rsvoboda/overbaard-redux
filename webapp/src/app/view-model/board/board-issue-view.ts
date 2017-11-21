import {BoardIssue} from '../../model/board/data/issue/board-issue';

/**
 * Board issue with extra state calculated in the view model
 */
export interface BoardIssueView extends BoardIssue {
  // TODO other fields as needed
  visible: boolean;
}

