import {makeTypedFactory, TypedRecord} from 'typed-immutable-record';
import {OrderedMap} from 'immutable';

export interface AssigneeState {
  assignees: OrderedMap<string, Assignee>;
}

export interface Assignee {
  key: string;
  email: string;
  avatar: string;
  name: string;
  initials: string;
}

const DEFAULT_STATE: AssigneeState = {
  assignees: OrderedMap<string, Assignee>()
};

const DEFAULT_ASSIGNEE: Assignee = {
  key: null,
  email: null,
  avatar: null,
  name: null,
  initials: null
};

interface AssigneeStateRecord extends TypedRecord<AssigneeStateRecord>, AssigneeState {
}

interface AssigneeRecord extends TypedRecord<AssigneeRecord>, Assignee {
}

const STATE_FACTORY = makeTypedFactory<AssigneeState, AssigneeStateRecord>(DEFAULT_STATE);
const ASSIGNEE_FACTORY = makeTypedFactory<Assignee, AssigneeRecord>(DEFAULT_ASSIGNEE);
export const initialAssigneeState: AssigneeState = STATE_FACTORY(DEFAULT_STATE);

export const NO_ASSIGNEE: Assignee = ASSIGNEE_FACTORY({
  key: '_____N$O$N$E____',
  email: '-',
  avatar: null,
  name: 'None',
  initials: '-'
});

export class AssigneeFactory {

  static fromJS(input: any): AssigneeRecord {
    input['initials'] = AssigneeFactory.calculateInitials(input['name']);
    return ASSIGNEE_FACTORY(input);
  }

  private static calculateInitials(name: string): string {

    const arr: string[] = name.split(' ');
    if (arr.length === 1) {
      let ret = '';
      for (let i = 0; i < 3 && i < arr[0].length; i++) {
        let char: string = arr[0][i];
        if (i === 0) {
          char = char.toUpperCase();
        } else {
          char = char.toLowerCase();
        }
        ret = ret + char;
      }
      return ret;
    }
    let ret = '';
    for (let i = 0; i < 3 && i < arr.length; i++) {
      ret = ret + arr[i][0];
    }
    return ret.toUpperCase();
  }
};

export class AssigneeStateModifier {
  static update(state: AssigneeState, updater: (copy: AssigneeState) => void) {
    return (<AssigneeStateRecord>state).withMutations(updater);
  }
}



