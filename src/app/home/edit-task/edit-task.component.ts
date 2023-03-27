import { Component, Inject } from '@angular/core';
import { HomeService } from '../home.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../home.component';
import { DatePipe, formatDate } from '@angular/common';


@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent {
  name: string = this.data.name;
  done: boolean = this.data.done;
  deadline: any;

  constructor(private homeService: HomeService, @Inject(MAT_DIALOG_DATA) public data: Task, private datePipe: DatePipe) {
    this.deadline = this.datePipe.transform(this.data.deadline, "yyyy-MM-dd'T'HH:mm");
  }

  editTask() {
    let task = { id: this.data.id, name: this.name, done: this.done, deadline: this.deadline };
    this.homeService.editTask(task).subscribe();
  }
}
