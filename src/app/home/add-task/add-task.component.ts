import { Component } from '@angular/core';
import { HomeService } from '../home.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent {
  name: string = '';
  done: boolean = false;
  deadline: any;

  constructor(private homeService: HomeService, private datePipe: DatePipe) {
    this.deadline = this.datePipe.transform(new Date(), "yyyy-MM-dd'T'HH:mm");
  }

  addNewTask() {
    let task = { name: this.name, done: this.done, deadline: new Date(this.deadline) };
    this.homeService.addTask(task).subscribe();
  }
}
