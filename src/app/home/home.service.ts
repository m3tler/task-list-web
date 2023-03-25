import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from './home.component';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Basic ' + btoa('admin:admin')
    })
  };

  constructor(private http: HttpClient) { }

  public addTask(task: any) {
    return this.http.post<Task>('http://localhost:8080/tasks', task, this.httpOptions);
  }

  public getTasks() {
    return this.http.get<Task[]>('http://localhost:8080/tasks', this.httpOptions).pipe(tap(tasks => {tasks.sort((t1, t2) => t1.id - t2.id)}));
  }

  public deleteTasks(ids: number[]) {
    return this.http.delete('http://localhost:8080/tasks/' + ids.join(','), this.httpOptions);
  }

  public editTask(task: any) {
    return this.http.put('http://localhost:8080/tasks/' + task.id, {name: task.name, done: task.done, deadline: task.deadline}, this.httpOptions);
  }
}
