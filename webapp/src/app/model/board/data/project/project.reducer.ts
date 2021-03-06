import {Action, createSelector} from '@ngrx/store';
import {BoardProject, initialProjectState, LinkedProject, ParallelTask, ProjectState, ProjectUtil} from './project.model';
import {List, Map, OrderedMap} from 'immutable';
import {AppState} from '../../../../app-store';
import {cloneObject} from '../../../../common/object-util';

const DESERIALIZE_PROJECTS = 'DESERIALIZE_PROJECTS';

class DeserializeProjectsAction implements Action {
  readonly type = DESERIALIZE_PROJECTS;

  // TODO payload
  constructor(readonly payload: ProjectState) {
  }
}

export class ProjectActions {
  static createDeserializeProjects(input: any): DeserializeProjectsAction {
    const boardProjects: OrderedMap<string, BoardProject> = OrderedMap<string, BoardProject>().asMutable();
    const linkedProjects: Map<string, LinkedProject> = Map<string, LinkedProject>().asMutable();
    const parallelTasks: Map<string, List<ParallelTask>> = Map<string, List<ParallelTask>>().asMutable();

    const mainInput: any = input['main'];

    for (const projectInput of mainInput) {
      const project: BoardProject = ProjectUtil.boardProjectFromJs(projectInput);
      boardProjects.set(project.key, project);
      let parallelTasksInput: any[] = projectInput['parallel-tasks'];
      if (parallelTasksInput) {
        // Something makes this read-only so clone it
        parallelTasksInput = cloneObject(parallelTasksInput);
        for (let i = 0 ; i < parallelTasksInput.length ; i++) {
          const task: ParallelTask = ProjectUtil.parallelTaskFromJs(parallelTasksInput[i]);
          parallelTasksInput[i] = task;
          parallelTasks.set(project.key, List<ParallelTask>(parallelTasksInput));
        }
      }
    }

    const linkedInput = input['linked'];
    if (linkedInput) {
      for (const key of Object.keys(linkedInput)) {
        const projectInput: any = linkedInput[key];
        linkedProjects.set(key, ProjectUtil.linkedProjectFromJs(key, projectInput));
      }
    }

    const payload: ProjectState = {
      boardProjects: boardProjects.asImmutable(),
      linkedProjects: linkedProjects.asImmutable(),
      parallelTasks: parallelTasks.asImmutable()
    };

    return new DeserializeProjectsAction(payload);
  }
}

// 'meta-reducer here means it is not called directly by the store, rather from the boardReducer
export function projectMetaReducer(state: ProjectState = initialProjectState, action: Action): ProjectState {
  switch (action.type) {
    case DESERIALIZE_PROJECTS: {
      const payload: ProjectState = (<DeserializeProjectsAction>action).payload;
      return ProjectUtil.withMutations(state, mutable => {
        if (!mutable.boardProjects.equals(payload.boardProjects)) {
          mutable.boardProjects = payload.boardProjects;
        }
        if (!mutable.linkedProjects.equals(payload.linkedProjects)) {
          mutable.linkedProjects = payload.linkedProjects;
        }
        if (!mutable.parallelTasks.equals(payload.parallelTasks)) {
          mutable.parallelTasks = payload.parallelTasks;
        }
      });
    }
  }
  return state;
}

const getProjectState = (state: AppState): ProjectState => state.board.projects;
const getBoardProjects = (state: ProjectState): OrderedMap<string, BoardProject> => state.boardProjects;
const getLinkedProjects = (state: ProjectState): Map<string, LinkedProject> => state.linkedProjects;
const getParallelTasks = (state: ProjectState): OrderedMap<string, List<ParallelTask>> => state.parallelTasks;
export const boardProjectsSelector = createSelector(getProjectState, getBoardProjects);
export const parallelTasksSelector = createSelector(getProjectState, getParallelTasks);
export const linkedProjectsSelector = createSelector(getProjectState, getLinkedProjects);
