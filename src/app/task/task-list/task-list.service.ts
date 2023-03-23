import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskListService {
  private url = 'http://localhost:8080/tasks';

  constructor(private httpClient: HttpClient) { }

  getTasks() {
    return this.httpClient.get(this.url);
  }
}
