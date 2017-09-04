import {List, Map} from 'immutable';
import {makeTypedFactory, TypedRecord} from 'typed-immutable-record';

export interface ProjectState {
  owner: string;
  boardProjects: Map<string, BoardProject>;
  rankedIssueKeys: Map<string, List<string>>;
  linkedProjects: Map<string, LinkedProject>;
}

export interface BaseProject {
  key: string;
}

export interface BoardProject extends BaseProject {
  colour: string;
  canRank: boolean;
  boardStateNameToOwnStateName: Map<string, string>;
}

export interface LinkedProject extends BaseProject {
  states: List<string>;
}

const DEFAULT_STATE: ProjectState = {
  owner: null,
  boardProjects: Map<string, BoardProject>(),
  rankedIssueKeys: Map<string, List<string>>(),
  linkedProjects: Map<string, LinkedProject>()
};

const DEFAULT_BOARD_PROJECT: BoardProject = {
  key: null,
  colour: null,
  canRank: false,
  boardStateNameToOwnStateName: Map<string, string>()
};

const DEFAULT_LINKED_PROJECT: LinkedProject = {
  key: null,
  states: List<string>()
};

interface ProjectStateRecord extends TypedRecord<ProjectStateRecord>, ProjectState {
}

interface BoardProjectRecord extends TypedRecord<BoardProjectRecord>, BoardProject {
}

interface LinkedProjectRecord extends TypedRecord<LinkedProjectRecord>, LinkedProject {
}

const STATE_FACTORY = makeTypedFactory<ProjectState, ProjectStateRecord>(DEFAULT_STATE);
const BOARD_PROJECT_FACTORY = makeTypedFactory<BoardProject, BoardProjectRecord>(DEFAULT_BOARD_PROJECT);
const LINKED_PROJECT_FACTORY = makeTypedFactory<LinkedProject, LinkedProjectRecord>(DEFAULT_LINKED_PROJECT);
export const initialProjectState: ProjectState = STATE_FACTORY(DEFAULT_STATE);

export class ProjectFactory {
  static boardProjectFromJs(key: string, input: any): BoardProject {
    const boardStateNameToOwnStateName: Map<string, string> = Map<string, string>(input['state-links']);
    const projectInput: BoardProject = {
      key: key,
      colour: input['colour'],
      canRank: input['rank'] ? input['rank'] : false,
      boardStateNameToOwnStateName: boardStateNameToOwnStateName
    };
    return BOARD_PROJECT_FACTORY(projectInput);
  }

  static linkedProjectFromJs(key: string, input: any) {
    const projectInput: LinkedProject = {
      key: key,
      states: List<string>(input['states'])
    };
    return LINKED_PROJECT_FACTORY(projectInput);
  }
}

export class ProjectStateModifier {
  static update(state: ProjectState, updater: (copy: ProjectState) => void) {
    return (<ProjectStateRecord>state).withMutations(updater);
  }
}
