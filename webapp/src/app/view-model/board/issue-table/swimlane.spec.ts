import {List, OrderedSet, Set} from 'immutable';
import {IssueTable, SwimlaneData, SwimlaneInfo} from './issue-table';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import {IssuesFactory, IssueTableObservableUtil} from './issue-table.common.spec';
import {Dictionary} from '../../../common/dictionary';
import {DeserializeIssueLookupParams} from '../../../model/board/data/issue/issue.model';
import {NONE_FILTER} from '../../../model/board/user/board-filter/board-filter.constants';


describe('Swimlane observer tests', () => {

  describe('Create with swimlane selected', () => {
    describe('No filters', () => {
      it('Project', () => {
        createUtil(
          {swimlane: 'project'},
          {'ONE' : [4, 3, 2, 1], 'TWO': [3, 2, 1]},
          new SwimlaneIssueFactory()
            .addIssue('ONE-1', 0)
            .addIssue('ONE-2', 0)
            .addIssue('ONE-3', 1)
            .addIssue('ONE-4', 2)
            .addIssue('TWO-1', 0)
            .addIssue('TWO-2', 1)
            .addIssue('TWO-3', 1))
        .tableObserver().take(1).subscribe(
          issueTable => {
            new IssueTableChecker([['ONE-2', 'ONE-1'], ['ONE-3', 'TWO-1'], ['ONE-4', 'TWO-3', 'TWO-2']], [])
              .setSwimlanes([
                {key: 'ONE', name: 'ONE', issues: ['ONE-1', 'ONE-2', 'ONE-3', 'ONE-4']},
                {key: 'TWO', name: 'TWO', issues: ['TWO-1', 'TWO-2', 'TWO-3']}])
              .checkTable(issueTable);
        });
      });

      it('Issue Type', () => {
        createUtil(
          {swimlane: 'issue-type'},
          {'ONE': [1, 2, 3, 4, 5]},
          new SwimlaneIssueFactory()
            // Use the default issue type values
            .addIssue('ONE-1', 0)
            .addIssue('ONE-2', 0)
            .addIssue('ONE-3', 0)
            .addIssue('ONE-4', 1)
            .addIssue('ONE-5', 1))
        .tableObserver().take(1).subscribe(
          issueTable => {
            new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
              .setSwimlanes([
                {key: 'task', name: 'task', issues: ['ONE-2', 'ONE-4']},
                {key: 'bug', name: 'bug', issues: ['ONE-1', 'ONE-3', 'ONE-5']}])
              .checkTable(issueTable);
          });
      });

      it('Priority', () => {
        createUtil(
          {swimlane: 'priority'},
          {'ONE': [1, 2, 3, 4, 5]},
          new SwimlaneIssueFactory()
          // Use the default priorities values
            .addIssue('ONE-1', 0)
            .addIssue('ONE-2', 0)
            .addIssue('ONE-3', 0)
            .addIssue('ONE-4', 1)
            .addIssue('ONE-5', 1))
          .tableObserver().take(1).subscribe(
          issueTable => {
            new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
              .setSwimlanes([
                {key: 'Blocker', name: 'Blocker', issues: ['ONE-1', 'ONE-3', 'ONE-5']},
                {key: 'Major', name: 'Major', issues: ['ONE-2', 'ONE-4']}])
              .checkTable(issueTable);
          });
      });

      it('Assignee', () => {
        createUtil(
          {swimlane: 'assignee'},
          {'ONE': [1, 2, 3, 4, 5]},
          new SwimlaneIssueFactory()
          // Use the default priorities values
            .addIssue('ONE-1', 0)
            .addIssue('ONE-2', 0)
            .addIssue('ONE-3', 0)
            .addIssue('ONE-4', 1)
            .addIssue('ONE-5', 1))
          .tableObserver().take(1).subscribe(
          issueTable => {
            new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
              .setSwimlanes([
                {key: 'bob', name: 'Bob Brent Barlow', issues: ['ONE-3']},
                {key: 'kabir', name: 'Kabir Khan', issues: ['ONE-1', 'ONE-4']},
                {key: NONE_FILTER, name: 'None', issues: ['ONE-2', 'ONE-5']}])
              .checkTable(issueTable);
          });
      });

      it ('Components', () => {
        createUtil(
          {swimlane: 'component'},
          {'ONE': [1, 2, 3, 4, 5]},
          new SwimlaneIssueFactory()
          // Use the default priorities values
            .addIssue('ONE-1', 0, {components: [0]})
            .addIssue('ONE-2', 0, {components: [1]})
            .addIssue('ONE-3', 0, {components: [2]})
            .addIssue('ONE-4', 1, {components: [0, 1, 2]})
            .addIssue('ONE-5', 1))
          .tableObserver().take(1).subscribe(
          issueTable => {
            new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
              .setSwimlanes([
                {key: 'C-10', name: 'C-10', issues: ['ONE-1', 'ONE-4']},
                {key: 'C-20', name: 'C-20', issues: ['ONE-2', 'ONE-4']},
                {key: 'C-30', name: 'C-30', issues: ['ONE-3', 'ONE-4']},
                {key: NONE_FILTER, name: 'None', issues: ['ONE-5']}])
              .checkTable(issueTable);
          });
      });

      it ('Fix Versions', () => {
        createUtil(
          {swimlane: 'fix-version'},
          {'ONE': [1, 2, 3, 4, 5]},
          new SwimlaneIssueFactory()
          // Use the default priorities values
            .addIssue('ONE-1', 0, {'fix-versions': [0]})
            .addIssue('ONE-2', 0, {'fix-versions': [1]})
            .addIssue('ONE-3', 0, {'fix-versions': [2]})
            .addIssue('ONE-4', 1, {'fix-versions': [0, 1, 2]})
            .addIssue('ONE-5', 1))
          .tableObserver().take(1).subscribe(
          issueTable => {
            new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
              .setSwimlanes([
                {key: 'F-10', name: 'F-10', issues: ['ONE-1', 'ONE-4']},
                {key: 'F-20', name: 'F-20', issues: ['ONE-2', 'ONE-4']},
                {key: 'F-30', name: 'F-30', issues: ['ONE-3', 'ONE-4']},
                {key: NONE_FILTER, name: 'None', issues: ['ONE-5']}])
              .checkTable(issueTable);
          });
      });

      it ('Labels', () => {
        createUtil(
          {swimlane: 'label'},
          {'ONE': [1, 2, 3, 4, 5]},
          new SwimlaneIssueFactory()
          // Use the default priorities values
            .addIssue('ONE-1', 0, {labels: [0]})
            .addIssue('ONE-2', 0, {labels: [1]})
            .addIssue('ONE-3', 0, {labels: [2]})
            .addIssue('ONE-4', 1, {labels: [0, 1, 2]})
            .addIssue('ONE-5', 1))
          .tableObserver().take(1).subscribe(
          issueTable => {
            new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
              .setSwimlanes([
                {key: 'L-10', name: 'L-10', issues: ['ONE-1', 'ONE-4']},
                {key: 'L-20', name: 'L-20', issues: ['ONE-2', 'ONE-4']},
                {key: 'L-30', name: 'L-30', issues: ['ONE-3', 'ONE-4']},
                {key: NONE_FILTER, name: 'None', issues: ['ONE-5']}])
              .checkTable(issueTable);
          });
      });

      it ('Custom Field', () => {
        createUtil(
          {swimlane: 'Custom-2'},
          {'ONE': [1, 2, 3, 4, 5]},
          new SwimlaneIssueFactory()
          // Use the default priorities values
            .addIssue('ONE-1', 0, {custom: {'Custom-2': 0}})
            .addIssue('ONE-2', 0, {custom: {'Custom-2': 1}})
            .addIssue('ONE-3', 0, {custom: {'Custom-2': 0}})
            .addIssue('ONE-4', 1, {custom: {'Custom-2': 1}})
            .addIssue('ONE-5', 1))
          .tableObserver().take(1).subscribe(
          issueTable => {
            new IssueTableChecker([['ONE-1', 'ONE-2', 'ONE-3'], ['ONE-4', 'ONE-5'], []], [])
              .setSwimlanes([
                {key: 'c2-A', name: 'First C2', issues: ['ONE-1', 'ONE-3']},
                {key: 'c2-B', name: 'Second C2', issues: ['ONE-2', 'ONE-4']},
                {key: NONE_FILTER, name: 'None', issues: ['ONE-5']}])
              .checkTable(issueTable);

          });
      });

      function createUtil(params: Dictionary<string>, ranks: Dictionary<number[]>, issueFactory: SwimlaneIssueFactory) {
        const util: IssueTableObservableUtil = new IssueTableObservableUtil('ONE', issueFactory, 3, params);
        for (const key of Object.keys(ranks)) {
          util.setRank(key, ...ranks[key]);
        }
        util
          .mapState('ONE', 'S-1', '1-1')
          .mapState('ONE', 'S-2', '1-2')
          .mapState('ONE', 'S-3', '1-3')
          .mapState('TWO', 'S-2', '2-1')
          .mapState('TWO', 'S-3', '2-2')
        util.emitBoardChange();
        return util;
      }
    });
    describe('Filters', () => {
      it('Project', () => {

      });
    });
  });
  describe('Switch to swimlane', () => {
    describe('No filters', () => {
      it('Project', () => {

      });
    });
    describe('Filters', () => {
      it('Project', () => {

      });
    });
  });
  describe('Update issues with swimlane selected', () => {
    describe('No filters', () => {
      it('Project', () => {

      });
    });
    describe('Filters', () => {
      it('Project', () => {

      });
    });
  });

  describe('Apply filters', () => {
  });
});

class IssueTableChecker {
  private _expectedSwimlanes: SwimlaneCheck[];
  constructor(private _expectedTable: string[][], private _expectedInvisible: string[]) {
  }

  setTable(table: string[][]): IssueTableChecker {
    this._expectedTable = table;
    return this;
  }

  setInvisible(invisible: string[]): IssueTableChecker {
    this._expectedInvisible = invisible;
    return this;
  }

  setSwimlanes(swimlanes: SwimlaneCheck[]): IssueTableChecker {
    this._expectedSwimlanes = swimlanes;
    return this;
  }

  checkTable(issueTable: IssueTable) {
    const actualTable: string[][] = [];
    issueTable.table.forEach((v, i) => {
      actualTable.push(issueTable.table.get(i).toArray());
    });
    expect(actualTable).toEqual(this._expectedTable);

    // Check the size of the issues map
    expect(issueTable.issues.size).toBe(this._expectedTable.map(issues => issues.length).reduce((s, c) => s + c));

    // Check issue visibilities
    const invisibleKeys: string[] =
      issueTable.issues.filter(issue => !issue.visible).keySeq().toArray().sort((a, b) => a.localeCompare(b));
    expect(invisibleKeys).toEqual(this._expectedInvisible.sort((a, b) => a.localeCompare(b)));

    // Check issue counts
    const invisibleSet: Set<string> = Set<string>(this._expectedInvisible);
    const visibleIssueCounts: number[] = new Array<number>(this._expectedTable.length);
    for (let i = 0 ; i < this._expectedTable.length ; i++) {
      visibleIssueCounts[i] = this._expectedTable[i].reduce((s, v, ind, arr) => {
        return invisibleSet.contains(arr[ind]) ? s : s + 1;
      }, 0);
    }
    expect(issueTable.visibleIssueCounts.toArray()).toEqual(visibleIssueCounts);

    if (!this._expectedSwimlanes) {
      expect(issueTable.swimlaneInfo).toBeFalsy();
    } else {
      expect(issueTable.swimlaneInfo).toBeTruthy();
      this.checkSwimlanes(issueTable);
    }
  }

  private checkSwimlanes(issueTable: IssueTable) {
    const slInfo: SwimlaneInfo = issueTable.swimlaneInfo;
    // Check the names and keys are as expected
    expect(slInfo.swimlanes.size).toBe(this._expectedSwimlanes.length);
    expect(slInfo.swimlanes.keySeq().toArray()).toEqual(this._expectedSwimlanes.map(sl => sl.key));
    expect(slInfo.swimlanes.map(sd => sd.display).toArray()).toEqual(this._expectedSwimlanes.map(sl => sl.name));

    for (const check of this._expectedSwimlanes) {
      const checkIssueSet: Set<string> = Set<string>(check.issues);
      const sl: SwimlaneData = slInfo.swimlanes.get(check.key);

      const expectedTable: string[][] = [];
      issueTable.table.forEach((v, i) => {
        expectedTable.push(issueTable.table.get(i).toArray().filter(key =>  checkIssueSet.contains(key)));
      });
      const actualTable: string[][] = [];
      sl.table.forEach((v, i) => {
        actualTable.push(sl.table.get(i).toArray());
      });
      expect(actualTable).toEqual(expectedTable);
      expect(sl.visibleIssues).toBe(check.issues.reduce((s, key) => issueTable.issues.get(key).visible ? s + 1 : s, 0));
    }
  }
}

interface SwimlaneCheck {
  key: string,
  name: string,
  issues: string[]
}

function checkSameColumns(oldState: IssueTable, newState: IssueTable, ...cols: number[]) {
  const expectedEqual: OrderedSet<number> = OrderedSet<number>(cols);
  expect(oldState.table.size).toBe(newState.table.size);
  for (let i = 0 ; i < oldState.table.size ; i++) {
    const oldCol: List<string> = oldState.table.get(i);
    const newCol: List<string> = newState.table.get(i);
    if (expectedEqual.contains(i)) {
      expect(oldCol).toBe(newCol, 'Column ' + i);
    } else {
      expect(oldCol).not.toBe(newCol, 'Column ' + i);
    }
  }
}

class SwimlaneIssueFactory implements IssuesFactory {
  _issues: Dictionary<any>;

  clear() {
    this._issues = null;
  }

  addIssue(key: string, state: number, data?: any): SwimlaneIssueFactory {
    if (!this._issues) {
      this._issues = {};
    }
    this._issues[key] = !data ? {} : data;
    this._issues[key]['state'] = state;
    return this;
  }

  createIssueStateInput(params: DeserializeIssueLookupParams): any {
    const input: any = {};
    for (const key of Object.keys(this._issues)) {
      const id = Number(key.substr(key.indexOf('-') + 1));
      const assignee: number = id % 3 === 2 ? null : id % 3;
      const isssue = {
        key: key,
        type: id % 2,
        priority: (id + 1) % 2,
        assignee: assignee
      };

      const data: any = this._issues[key];
      for (const override of Object.keys(data)) {
        isssue[override] = data[override]
      }

      input[key] = isssue;
    }

    return input;
  }
}



