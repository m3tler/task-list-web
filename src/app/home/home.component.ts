import {LiveAnnouncer} from '@angular/cdk/a11y';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {AfterViewInit, Component, Inject, ViewChild} from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Observable } from 'rxjs';
import { AddTaskComponent } from './add-task/add-task.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  dataSource = new MatTableDataSource();
  tasks: Task[] = [];
  displayedColumns: string[] = ['buttons', 'name', 'done', 'deadline'];

  constructor(private http: HttpClient, private _liveAnnouncer: LiveAnnouncer,public dialog: MatDialog) {
    this.getTasks().subscribe(tasks => this.tasks = tasks);
    this.dataSource.data = this.tasks;
  }

  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

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

  public getTasks() : Observable<Task[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Basic ' + btoa('admin:admin')
      })
    };
    return this.http.get<Task[]>('http://localhost:8080/tasks', httpOptions);
  }

  tabChanged(event: any) {
    switch(event.tab.textLabel) {
      case "Wszystkie": {
        this.dataSource.data = this.tasks;
        break;
      }
      case "Wykonane": {
        this.dataSource.data = this.tasks.filter((task: any) => {
          return task.done === true;
        });
        break;
      }
      case "Oczekujące": {
        this.dataSource.data = this.tasks.filter((task: any) => {
          return new Date(task.deadline) > new Date();
        });
        break;
      }
      case "Przeterminowane": {
        this.dataSource.data = this.tasks.filter((task: any) => {
          return new Date(task.deadline) < new Date();
        });
        break;
      }
    }
  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(AddTaskComponent, dialogConfig);
  }
}

export interface Task {
  name: string;
  done: boolean;
  deadline: any;
}
