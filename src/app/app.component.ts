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
  apiUrl = 'http://a66b797e5e17b4c7999aa09446928b8c-1506866256.eu-north-1.elb.amazonaws.com/todos';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.http.get<any[]>(this.apiUrl).subscribe(data => this.todos = data);
  }

  addTodo() {
    this.http.post<any>(this.apiUrl, { title: this.newTodo.value, completed: false }).subscribe(todo => {
      this.todos.push(todo);
      this.newTodo.reset();
    });
  }

  deleteTodo(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      this.todos = this.todos.filter(todo => todo.id !== id);
    });
  }
}
