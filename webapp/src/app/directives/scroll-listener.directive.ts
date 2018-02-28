import {
  AfterViewInit, Directive, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output,
  Renderer2
} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromEvent';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';


@Directive({
  selector: '[appScrollListener]'
})
export class ScrollListenerDirective implements OnInit, OnDestroy, AfterViewInit {

  /**
   * Values emitted on this observer are OUTSIDE the angular zone.
   * If null the left value is not emitted.
   */
  @Input()
  scrollLeftObserver: Subject<number>;

  /**
   * Values emitted on this observer are OUTSIDE the angular zone.
   * If null the top value is not emitted.
   */
  @Input()
  scrollTopObserver: Subject<number>;



  private _disposeScrollHandler: () => void | undefined;
  private refreshHandler = () => {
    this.refresh();
  };


  constructor(private _ref: ElementRef,
              private readonly _renderer: Renderer2,
              private readonly _zone: NgZone) {
  }

  ngOnInit(): void {
    this.addParentEventHandlers(this._ref.nativeElement);
  }

  ngOnDestroy(): void {
    this.removeParentEventHandlers();
  }

  ngAfterViewInit(): void {
    this.refresh();
  }

  private addParentEventHandlers(parentScroll: Element) {
    this.removeParentEventHandlers();
    this._zone.runOutsideAngular(() => {
      this._disposeScrollHandler =
        this._renderer.listen(parentScroll, 'scroll', this.refreshHandler);
    });
  }

  private removeParentEventHandlers() {
    if (this._disposeScrollHandler) {
      this._disposeScrollHandler();
      this._disposeScrollHandler = undefined;
    }
  }

  refresh() {
    this._zone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        if (this.scrollLeftObserver) {
          this.scrollLeftObserver.next(this._ref.nativeElement.scrollLeft);
        }
        if (this.scrollTopObserver) {
          this.scrollTopObserver.next(this._ref.nativeElement.scrollTop);
        }
      });
    });
  }

}
