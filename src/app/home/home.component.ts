import {LiveAnnouncer} from '@angular/cdk/a11y';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { AddTaskComponent } from './add-task/add-task.component';
import { HomeService } from './home.service';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { DeleteTasksComponent } from './delete-tasks/delete-tasks.component';
import { EditTaskComponent } from './edit-task/edit-task.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnInit {
  dataSource = new MatTableDataSource();
  tasks$: Observable<Task[]>;
  refreshTasks$ = new BehaviorSubject<boolean>(true);
  selectedItems: number[] = [];
  displayedColumns: string[] = ['buttons', 'name', 'done', 'deadline'];

  constructor(private http: HttpClient, private _liveAnnouncer: LiveAnnouncer,public dialog: MatDialog, private homeService: HomeService) {
    this.tasks$ = this.refreshTasks$.pipe(switchMap(_ => this.homeService.getTasks()));
    this.tasks$.subscribe(tasks => this.dataSource.data = tasks);
  }

  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  ngOnInit(): void {
    this.tasks$ = this.refreshTasks$.pipe(switchMap(_ => this.homeService.getTasks()));
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  update() {
    this.refreshTasks$.next(true);
  }

  tabChanged(event: any) {
    switch(event.tab.textLabel) {
      case "Wszystkie": {
        this.tasks$.subscribe(tasks => this.dataSource.data = tasks);
        break;
      }
      case "Wykonane": {
        this.tasks$.subscribe(tasks => this.dataSource.data = tasks.filter((task: any) => {
          return task.done === true;
        }));
        break;
      }
      case "Oczekujące": {
        this.tasks$.subscribe(tasks => this.dataSource.data = tasks.filter((task: any) => {
          return new Date(task.deadline) > new Date();
        }));
        break;
      }
      case "Przeterminowane": {
        this.tasks$.subscribe(tasks => this.dataSource.data = tasks.filter((task: any) => {
          return new Date(task.deadline) < new Date();
        }));
        break;
      }
    }
  }

  addTask(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;

    let dialogRef = this.dialog.open(AddTaskComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => this.update());
  }

  deleteSelectedTasks(): void {
    if(this.selectedItems.length === 0) return;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.data = this.selectedItems;

    let dialogRef = this.dialog.open(DeleteTasksComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => this.update())
  }

  editTask(task: Task) : void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.data = task;

    let dialogRef = this.dialog.open(EditTaskComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => this.update());
  }

  setDone(task: Task) : void {
    this.homeService.editTask(task).subscribe();
  }

  changeSelection(id: number) {
    if(this.selectedItems.includes(id)) this.selectedItems.splice(this.selectedItems.indexOf(id), 1);
    else this.selectedItems.push(id);
  }
}

export interface Task {
  id: number;
  name: string;
  done: boolean;
  deadline: Date;
}
