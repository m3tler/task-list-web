import { Component, OnInit } from '@angular/core';
import { TaskListService } from './task-list.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: any;

  constructor(private taskListService: TaskListService) {}

  ngOnInit(): void {
    this.taskListService.getTasks().subscribe(response => {this.tasks = response});
  }
}
