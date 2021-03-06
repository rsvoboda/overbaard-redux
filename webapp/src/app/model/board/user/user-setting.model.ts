import {initialBoardFilterState} from './board-filter/board-filter.model';
import {makeTypedFactory, TypedRecord} from 'typed-immutable-record';
import {Map} from 'immutable';
import {UserSettingState} from './user-setting';
import {BoardViewMode} from './board-view-mode';
import {initialIssueDetailState} from './issue-detail/issue-detail.model';

const DEFAULT_STATE: UserSettingState = {
  boardCode: '',
  viewMode: BoardViewMode.KANBAN,
  forceBacklog: false,
  showBacklog: false,
  swimlane: undefined,
  swimlaneShowEmpty: false,
  filters: initialBoardFilterState,
  defaultColumnVisibility: true,
  columnVisibilities: Map<number, boolean>(),
  defaultCollapsedSwimlane: false,
  collapsedSwimlanes: Map<string, boolean>(),
  issueDetail: initialIssueDetailState
};


interface UserSettingStateRecord extends TypedRecord<UserSettingStateRecord>, UserSettingState {
}

const STATE_FACTORY = makeTypedFactory<UserSettingState, UserSettingStateRecord>(DEFAULT_STATE);
export const initialUserSettingState: UserSettingState = STATE_FACTORY(DEFAULT_STATE);

export class UserSettingUtil {

  static updateUserSettingState(userSettingState: UserSettingState, mutate: (mutable: UserSettingState) => any): UserSettingState {
    return (<UserSettingStateRecord>userSettingState).withMutations(mutable => {
      return mutate(mutable);
    });
  }
}
