import {BrowserModule} from '@angular/platform-browser';
import {NgModule, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {APP_BASE_HREF, HashLocationStrategy, LocationStrategy} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {initialAppState, metaReducers, reducers} from './app-store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../environments/environment';
import {BoardsComponent} from './components/boards/boards.component';
import {UrlService} from './services/url.service';
import {BoardComponent} from './components/board/board.component';
import {AppHeaderService} from './services/app-header.service';
import {KanbanViewComponent} from './components/board/view/kanban-view/kanban-view.component';
import {RankViewComponent} from './components/board/view/rank-view/rank-view.component';
import {BoardHeadersContainerComponent} from './components/board/view/board-view-headers/board-headers-container.component';
import {BoardHeaderGroupComponent} from './components/board/view/board-view-headers/board-header-group.component';
import {BoardHeaderContentComponent} from './components/board/view/board-view-headers/board-header-content.component';
import {KanbanNormalViewComponent} from './components/board/view/kanban-view/kanban-normal-view/kanban-normal-view.component';
import {KanbanViewColumnGroupComponent} from './components/board/view/kanban-view/kanban-view-column/kanban-view-column-group.component';
import {KanbanViewColumnComponent} from './components/board/view/kanban-view/kanban-view-column/kanban-view-column.component';
import {BoardIssueComponent} from './components/board/issue/board-issue.component';
import {KanbanSwimlaneViewComponent} from './components/board/view/kanban-view/kanban-view-swimlane/kanban-swimlane-view.component';
import {KanbanSwimlaneEntryComponent} from './components/board/view/kanban-view/kanban-view-swimlane/kanban-swimlane-entry.component';
import {HttpClientModule} from '@angular/common/http';
import {ConfigurationComponent} from './components/config/configuration.component';
import {BoardConfigurationComponent} from './components/config/board-configuration-component';
import {RankViewEntryComponent} from './components/board/view/rank-view/rank-view-entry.component';
import {RankViewContainerComponent} from './components/board/view/rank-view/rank-view-container.component';
import {ProgressLogService} from './services/progress-log.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material.module';
import {BoardSettingsDrawerComponent} from './components/board/settings-drawer/settings-drawer.component';
import {VersionService} from './services/version.service';
import {ParallelTaskSelectorComponent} from './components/board/issue/parallel-task-selector.component';
import {ParallelTaskComponent} from './components/board/issue/parallel-task.component';
import {MoveIssueDialogComponent} from './components/board/issue/move-issue-dialog.component';
import {CommentIssueDialogComponent} from './components/board/issue/comment-issue-dialog.component';
import {MatSnackBar} from '@angular/material';
import {RankIssueDialogComponent} from './components/board/issue/rank-issue-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardsComponent,
    BoardComponent,
    BoardSettingsDrawerComponent,
    ConfigurationComponent,
    BoardConfigurationComponent,
    KanbanViewComponent,
    KanbanNormalViewComponent,
    KanbanViewColumnGroupComponent,
    KanbanViewColumnComponent,
    KanbanSwimlaneViewComponent,
    KanbanSwimlaneEntryComponent,
    RankViewComponent,
    RankViewContainerComponent,
    RankViewEntryComponent,
    BoardHeaderContentComponent,
    BoardHeaderGroupComponent,
    BoardHeadersContainerComponent,
    BoardIssueComponent,
    ParallelTaskComponent,
    ParallelTaskSelectorComponent,
    MoveIssueDialogComponent,
    CommentIssueDialogComponent,
    RankIssueDialogComponent
  ],
  entryComponents: [
    CommentIssueDialogComponent,
    MoveIssueDialogComponent,
    ParallelTaskSelectorComponent,
    RankIssueDialogComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers, {initialState: initialAppState, metaReducers: metaReducers}),
    !environment.production ? StoreDevtoolsModule.instrument({ maxAge: 50 }) : []
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/'},
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    AppHeaderService,
    ProgressLogService,
    UrlService,
    VersionService
  ],

  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }


}
