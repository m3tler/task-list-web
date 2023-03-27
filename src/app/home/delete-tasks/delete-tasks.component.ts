import { Component, Inject } from '@angular/core';
import { HomeService } from '../home.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-tasks',
  templateUrl: './delete-tasks.component.html',
  styleUrls: ['./delete-tasks.component.css']
})
export class DeleteTasksComponent {

  constructor(private homeService: HomeService, @Inject(MAT_DIALOG_DATA) public data: number[]) { }

  deleteSelectedTasks() {
    this.homeService.deleteTasks(this.data).subscribe();
    this.data.length = 0;
  }
}
