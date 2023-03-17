import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IDetailQuote } from '../shared/interfaces/idetail-quote';
import { IQuote } from '../shared/interfaces/iquote';
import { TaskService } from '../shared/services/task.service';
import { Location } from '@angular/common'

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  quoteDetail: IDetailQuote;
  object = Object;

  constructor(private taskService: TaskService, private act: ActivatedRoute, private rtr: Router, private location: Location) { }
  ngOnInit(): void {
    const id = this.act.snapshot.params["id"];
    const quote = this.taskService.findQuoteById(id);
    if (quote) {
      this.quoteDetail = {
        "Quote ID": quote.QuoteID,
        "Quote Type": quote.QuoteType,
        "Sales Person": quote.Sales,
        "Premium Account": quote.Premium,
        "Due Date": quote.DueDate,
        "Description": quote.Description
      };
      console.log(this.quoteDetail);
    } else {
      this.rtr.navigate(["tasks"]);
    }
  }

  back() {
    this.location.back();
  }
}
