import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from './home.component';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa('admin:admin')
    })
  };

  constructor(private http: HttpClient) { }

  public addTask(task: any) {
    return this.http.post<Task>(environment.apiUrl + 'tasks', task, this.httpOptions);
  }

  public getTasks() {
    return this.http.get<Task[]>(environment.apiUrl + 'tasks', this.httpOptions).pipe(tap(tasks => { tasks.sort((t1, t2) => t1.id - t2.id) }));
  }

  public deleteTasks(ids: number[]) {
    return this.http.delete(environment.apiUrl + 'tasks/' + ids.join(','), this.httpOptions);
  }

  public editTask(task: any) {
    return this.http.put(environment.apiUrl + 'tasks/' + task.id, { name: task.name, done: task.done, deadline: task.deadline }, this.httpOptions);
  }
}
