import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddTaskComponent } from './add-task/add-task.component';
import { HomeService } from './home.service';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { DeleteTasksComponent } from './delete-tasks/delete-tasks.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { FormGroup, FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  dataSource = new MatTableDataSource<Task>();
  tasks$: Observable<Task[]>;
  refreshTasks$ = new BehaviorSubject<boolean>(true);
  selectedItems: number[] = [];
  displayedColumns: string[] = ['buttons', 'name', 'done', 'deadline'];
  searchName: string = '';
  searchStartDate: Date | undefined;
  searchEndDate: Date | undefined;
  searchDone: boolean = false;
  searchTodo: boolean = false;
  selectedTabLabel: string = 'Wszystkie';

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(private http: HttpClient, private _liveAnnouncer: LiveAnnouncer, public dialog: MatDialog, private homeService: HomeService) {
    this.tasks$ = this.refreshTasks$.pipe(switchMap(_ => this.homeService.getTasks()));
    this.tasks$.subscribe(tasks => this.dataSource.data = tasks);
  }

  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = this.customFilter();
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

  isTerminate(date: Date) {
    return new Date(date).getTime() < Date.now();
  }

  applyFilter(event: any) {
    if (event instanceof MatTabChangeEvent) {
      this.selectedTabLabel = event.tab.textLabel;
    }
    let filterValue = this.selectedTabLabel;
    this.dataSource.filter = filterValue;
  }

  customFilter(): (data: Task, filter: string) => boolean {
    return (data: Task, filter: string) => {
      let searching: boolean = data.name.toLowerCase().includes(this.searchName.toLowerCase());
      if (this.searchStartDate != undefined && this.searchEndDate != undefined) {
        searching = searching && new Date(data.deadline) >= new Date(this.searchStartDate) && new Date(data.deadline) <= new Date(this.searchEndDate);
      }
      if (this.searchDone && !this.searchTodo) {
        searching = searching && data.done == true;
      }
      else if (!this.searchDone && this.searchTodo) {
        searching = searching && data.done == false;
      }

      let filtering: boolean = true;
      switch (filter) {
        case "Wykonane": {
          filtering = data.done == true;
          break;
        }
        case "Oczekujące": {
          filtering = new Date(data.deadline) > new Date() && data.done == false;
          break;
        }
        case "Przeterminowane": {
          filtering = new Date(data.deadline) < new Date() && data.done == false;
          break;
        }
        default: { filtering = true }
      }
      return searching && filtering;
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
    if (this.selectedItems.length == 0) return;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.data = this.selectedItems;

    let dialogRef = this.dialog.open(DeleteTasksComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => this.update())
    console.log(this.selectedItems);
  }

  editTask(task: Task): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.data = task;

    let dialogRef = this.dialog.open(EditTaskComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(() => this.update());
  }

  setDone(task: Task): void {
    this.homeService.editTask(task).subscribe();
  }

  changeSelection(id: number) {
    if (this.selectedItems.includes(id)) this.selectedItems.splice(this.selectedItems.indexOf(id), 1);
    else this.selectedItems.push(id);
  }

  clearFilters() {
    this.searchName = '';
    this.searchStartDate = undefined;
    this.searchEndDate = undefined;
    this.searchDone = true;
    this.searchTodo = true;
    this.applyFilter(null);
  }

  changeDone() {
    if (this.searchDone == false) {
      this.searchTodo = true;
    }
    this.applyFilter(null);
  }

  changeTodo() {
    if (this.searchTodo == false) {
      this.searchDone = true;
    }
    this.applyFilter(null);
  }
}

export interface Task {
  id: number;
  name: string;
  done: boolean;
  deadline: Date;
}
