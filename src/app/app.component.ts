import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';  // Import FormControl

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  todos: any[] = [];

  newTodo = new FormControl('');
  apiUrl = 'http://localhost:8080/todos';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.http.get<any[]>(this.apiUrl).subscribe(data => this.todos = data);
  }

  addTodo() {
  console.log("newTodo bbbb=>", this.newTodo);
    this.http.post<any>(this.apiUrl, { title: this.newTodo.value, completed: false }).subscribe(todo => {
      this.todos.push(todo);
    });
  }

  deleteTodo(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      this.todos = this.todos.filter(todo => todo.id !== id);
    });
  }
}
