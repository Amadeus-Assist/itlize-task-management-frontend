import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { IQuote } from '../shared/interfaces/iquote';
import { DatePipe } from '@angular/common'
import { NgForm } from '@angular/forms';
import { TaskService } from '../shared/services/task.service';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-quote-modal',
  templateUrl: './quote-modal.component.html',
  styleUrls: ['./quote-modal.component.css']
})
export class QuoteModalComponent implements OnInit {
  @Input() title: string;
  @Input() type: string;
  @Input() quote: IQuote;
  date: NgbDateStruct;
  time: NgbTimeStruct;
  premiumStr: string;
  submitted: boolean = false

  constructor(public activeModal: NgbActiveModal, private datepipe: DatePipe, private taskService: TaskService, private alertService: AlertService) {}
  ngOnInit(): void {
    this.premiumStr = this.quote.Premium?.toFixed(0);
    const datetime = new Date(this.quote.DueDate);
    this.date = {
      year: datetime.getFullYear(),
      month: datetime.getMonth()+1,
      day: datetime.getDate(),
    }
    this.time = {
      hour: datetime.getHours(),
      minute: datetime.getMinutes(),
      second: datetime.getSeconds(),
    }
  }

  submit(form: NgForm) {
    this.submitted = true;
    if (!form.valid) {
      return;
    }
    this.quote.Premium = parseInt(this.premiumStr);
    const tmpDate = new Date();
    tmpDate.setFullYear(this.date.year);
    tmpDate.setMonth(this.date.month-1);
    tmpDate.setDate(this.date.day);
    tmpDate.setHours(this.time.hour);
    tmpDate.setMinutes(this.time.minute);
    tmpDate.setSeconds(this.time.second);
    this.quote.DueDate = new Date(this.datepipe.transform(tmpDate, 'yyyy-MM-ddTHH:mm:ss'));
    if (this.type === "add"){
      this.submitAdd();
    }else {
      this.submitUpdate();
    }
  }

  submitAdd() {
    this.taskService.addQuote(this.quote).subscribe({
      next: resp=>{
        this.alertService.emitAlert({
          alertType: "success",
          alertMessage: "add success!"
        });;
        setTimeout(() => {
          this.alertService.emitAlert(null);
        }, 2000);
        this.activeModal.close();
      },
      error: err=>{
        this.alertService.emitAlert({
          alertType: "danger",
          alertMessage: err["error"]?.["Message"] ? err["error"]?.["Message"] : "add failed"
        });
        setTimeout(() => {
          this.alertService.emitAlert(null);
        }, 2000);
      }
    });
  }

  submitUpdate() {
    this.taskService.editQuote(this.quote).subscribe({
      next: resp => 
      {
        this.alertService.emitAlert({
          alertType: "success",
          alertMessage: "update success!"
        });;
        setTimeout(() => {
          this.alertService.emitAlert(null);
        }, 2000);
        this.activeModal.close();
      },
      error: err => {
        this.alertService.emitAlert({
          alertType: "danger",
          alertMessage: err["error"]?.["Message"] ? err["error"]?.["Message"] : "update failed"
        });
        setTimeout(() => {
          this.alertService.emitAlert(null);
        }, 2000);
      }
    });
  }
}
