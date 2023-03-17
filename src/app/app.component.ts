import { Component, OnInit } from '@angular/core';
import { IAlert } from './shared/interfaces/ialert';
import { AlertService } from './shared/services/alert.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'task-management-frontend';
  alert: IAlert;

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.alertService.alterEmitter.subscribe((alert)=>this.alert = alert);
  }
}
