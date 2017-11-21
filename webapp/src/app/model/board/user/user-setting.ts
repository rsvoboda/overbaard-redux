import {BoardFilterState} from './board-filter/board-filter.model';
import {Map} from 'immutable';

export interface UserSettingState {
  boardCode: string;
  showBacklog: boolean;
  filters: BoardFilterState;
  /** The visibility value to use for column, if its index does not show up in columnVisibilities */
  defaultColumnVisibility: boolean;
  /** The column visibilities if any, initially set up by the query parameters */
  columnVisibilities: Map<number, boolean>;

  swimlane: string;
  swimlaneShowEmpty: boolean;
  /** The collapsed value to use for a swimlane, if its key does not show up in collapsedSwimlanes */
  defaultCollapsedSwimlane: boolean;
  /** The collapsed swimlanes if any, initially set up by the query parameters */
  collapsedSwimlanes: Map<string, boolean>;
}
