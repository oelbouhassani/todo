import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';  // Import Validators
import { interval } from 'rxjs';  // Import interval

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  todos: any[] = [];

  newTodo = new FormControl('', Validators.required)
  apiUrl = 'https://my00tey55i.execute-api.eu-north-1.amazonaws.com/main/todos';
  userIp : any;
  constructor(private http: HttpClient) {}

  ngOnInit() {
     // Set up a timer to reload data every 2 seconds
     this.http.get('https://api.ipify.org?format=json')
     .subscribe((data:any) => {
                            this.userIp = data.ip;
                                   });;
      this.loadTodos();
       interval(500).subscribe(() => {
         this.loadTodos();
       });
  }
  loadTodos() {
    this.http.get<any[]>(this.apiUrl).subscribe(data => this.todos = data);
  }

  addTodo() {
    this.http.post<any>(this.apiUrl, { title: "USER IP : " + this.userIp + " ===> " +this.newTodo.value, completed: false }).subscribe(todo => {
      this.loadTodos();
      this.newTodo.reset();
    });
  }

  deleteTodo(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
     this.loadTodos();
    });
  }

    exportToCSV() {
      if (this.todos.length === 0) return;

      const headers = ["ID", "Title", "Completed"];
      const csvRows = this.todos.map(todo => `${todo.id},${todo.title},${todo.completed}`);

      const csvContent = [headers.join(","), ...csvRows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("download", "todos.csv");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
}
