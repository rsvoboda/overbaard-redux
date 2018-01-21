import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, QueryList,
  ViewChildren
} from '@angular/core';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/catch';
import {List} from 'immutable';
import {FontSizeTableService} from '../../services/font-size-table.service';
import {EXTRA_ITEM, ISSUE_SUMMARY_NAME} from '../../view-model/board/issue-height-calculator';
import {Dictionary} from '../../common/dictionary';
import {SAME_CHAR_WIDTH_LOOKUP_TABLE} from './lookup-table';

@Component({
  selector: 'app-font-measure',
  template: `
    <!-- Do space separately -->
    <div
      #characterHolder>
      <div
        *ngFor=\"let setting of settings\"
        [ngClass]=\"setting.cssClass ? setting.cssClass : ''\"
        [ngStyle]=\"setting.style ? setting.style : {}\">
        <span class=\"class\"><span *ngFor=\"let i of hundredSpaces\">&nbsp;</span></span>
      </div>
    </div>
    <!-- Do the other characters -->
    <div
      *ngFor=\"let character of characters\"
      #characterHolder>
      <div
        *ngFor=\"let setting of settings\"
        [ngClass]=\"setting.cssClass ? setting.cssClass : ''\"
        [ngStyle]=\"setting.style ? setting.style : {}\">
        <span class=\"class\">{{character}}</span>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FontMeasureComponent implements OnInit, AfterViewInit {

  settingNames: List<string> = List<string>([
    ISSUE_SUMMARY_NAME,   // In the 'settings' list, the class that is used to display the issue summary
    EXTRA_ITEM]);         // In the 'settings' list, the style that is used to display linked issues and parallel tasks
  settings: List<Setting> =
    List<Setting>([Setting.fromClass('mat-caption'), Setting.fromStyle({'font-size': '14px'})]);
  characters: string[] = [];

  // Generated using FontMeasureTable
  private _sameCharLookupTable: Dictionary<string> = SAME_CHAR_WIDTH_LOOKUP_TABLE;

  @ViewChildren('characterHolder')
  characterHolders: QueryList<ElementRef>;
  hundredSpaces: number[] = new Array<number>(100);

  constructor(private _fontSizeTable: FontSizeTableService) {
  }

  ngOnInit(): void {
    const characters: string[] = [];
    for (const character of Object.keys(this._sameCharLookupTable)) {
      characters.push(character);
    }

    for (const char of characters) {
      let arr: string = char;
      let arr4: string;

      for (let i = 0 ; i < 5 ; i++) {
        arr += arr;
        if (i === 1) {
          arr4 = arr;
        }
      }
      const arr32: string = arr;
      arr = arr32 + arr32 + arr32 + arr4;
      this.characters.push(arr);
    }
  }


  ngAfterViewInit(): void {
    console.log('Starting font calculation');
    this._fontSizeTable.startModification();

    this._fontSizeTable.setSameCharTable(this._sameCharLookupTable);

    const elements: ElementRef[] = this.characterHolders.toArray();
    let isSpace = true; // The first is a space, and is displayed a bit differently from the rest
    for (const element of elements) {
      const childDivs: NodeListOf<HTMLElement> = element.nativeElement.querySelectorAll('div');
      let character: string;
      for (let i = 0 ; i < childDivs.length ; i++) {
        const divEl: HTMLElement = childDivs.item(i);
        const span: HTMLElement = divEl.querySelector('span');
        const text: string = span.textContent;
        if (i === 0) {
          if (isSpace) {
            character = ' '; // What is returned is actually '\" \"', which doesn't work in the lookup
            isSpace = false;
          } else {
            character = text.charAt(0);
          }
        }

        const width: number = span.offsetWidth / text.length;
        this._fontSizeTable.addItem(this.settingNames.get(i), character, width);
      }
    }

    this._fontSizeTable.completeModification();
    console.log(this._fontSizeTable);
  }
}

export class Setting {
  static fromClass(cssClass: string) {
    return new Setting(cssClass, null);
  }

  static fromStyle(style: any) {
    return new Setting(null, style);
  }

  constructor(public cssClass: string, public style: any) {
  }

  toString(): string {
    if (this.cssClass) {
      return `class=${this.cssClass}`;
    } else {
      return JSON.stringify(this.style);
    }
  }
}
