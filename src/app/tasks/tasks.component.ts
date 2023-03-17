import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, IterableDiffer, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { QuoteModalComponent } from '../quote-modal/quote-modal.component';
import { IQuote } from '../shared/interfaces/iquote';
import { AlertService } from '../shared/services/alert.service';
import { TaskService } from '../shared/services/task.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit, AfterViewInit{
  quotes: IQuote[] = [];
  dataColumns: string[][] = [['No.', 'Quote Type', 'Description', 'Sales', 'Due Date', 'Premium'], ['QuoteID', 'QuoteType', 'Description', 'Sales', 'DueDate', 'Premium']];
  columnNames: string[] = ['QuoteID', 'QuoteType', 'Description', 'Sales', 'DueDate', 'Premium', 'operate'];
  iterableDiffer:IterableDiffer<any>;
  dataSource: MatTableDataSource<IQuote> = new MatTableDataSource<IQuote>();
  pageSizeOptions: number[] = [5, 10, 15];
  sortCols: string[] = ['QuoteID', 'QuoteType', 'Sales', 'DueDate', 'Premium'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<IQuote>;

  constructor(private taskService: TaskService, private rtr: Router, private modalService: NgbModal, private alertService: AlertService, private datepipe: DatePipe){
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.paginator.page.subscribe({
      next: event=>{
        this.taskService.pageIndex = event.pageIndex;
      }
    })
  }

  ngOnInit(): void {
    this.taskService.quoteEmitter.subscribe((quotes)=>{
      this.quotes = quotes;
      this.filter();
      this.sort();
      this.dataSource.data = this.quotes;
    });
    this.taskService.getAllQuotes();
  }

  pageSize() {
    return this.taskService.pageSize;
  }

  changePageSize(event) {
    const eventValue = event.target.value;
    this.taskService.pageSize = parseInt(eventValue.substring(eventValue.indexOf(":")+2));
    this.paginator._changePageSize(this.taskService.pageSize);
  }

  pageIndex() {
    return this.taskService.pageIndex;
  }

  sortKey() {
    return this.taskService.sortKey;
  }

  checked() {
    return this.taskService.isDec;
  }

  changeSortKey(event) {
    const eventValue = event.target.value;
    this.taskService.sortKey = eventValue.substring(eventValue.indexOf(":")+2);
    this.sort();
    this.dataSource.data = this.quotes;
  }

  toggleCheck() {
    this.taskService.isDec = !this.taskService.isDec;
    this.sort();
    this.dataSource.data = this.quotes;
  }

  filterKey() {
    return this.taskService.filterKey;
  }

  filter() {
    if (this.taskService.filterKey) {
      const key = this.taskService.filterKey;
      this.quotes = this.taskService.quotes.filter((q)=>q.Description.toLowerCase().includes(key) || q.QuoteType.toLowerCase() == key || q.Sales.toLowerCase().includes(key));
    }else {
      this.quotes = this.taskService.quotes;
    }
  }

  doFilter(event) {
    if (event.keyCode == 13) {
      this.taskService.filterKey = event.target.value.toLowerCase();
      this.filter();
      this.dataSource.data = this.quotes;
    }
  }

  sort() {
    if (!this.taskService.isDec) {
      this.quotes.sort((q1, q2) => q1[this.taskService.sortKey] < q2[this.taskService.sortKey] ? -1 : 1);
    } else {
      this.quotes.sort((q1, q2) => q2[this.taskService.sortKey] < q1[this.taskService.sortKey] ? -1 : 1);
    }
  }

  add() {
    const modalRef = this.modalService.open(QuoteModalComponent, {size: 'lg'});
    modalRef.componentInstance.title = "Add New Quote";
    modalRef.componentInstance.quote = {
      QuoteID: 0,
      QuoteType: "Auto",
      DueDate: new Date()
    };
    modalRef.componentInstance.type = "add";
    modalRef.componentInstance.index = 0;
  }

  view(quote: IQuote) {
    this.rtr.navigate(["tasks", quote.QuoteID]);
  }

  edit(quote: IQuote) {
    const modalRef = this.modalService.open(QuoteModalComponent, {size: 'lg'});
    modalRef.componentInstance.title = "Update Quote";
    modalRef.componentInstance.quote = JSON.parse(JSON.stringify(quote));
    modalRef.componentInstance.type = "update";
  }

  delete(quote: IQuote) {
    const modalRef = this.modalService.open(ConfirmModalComponent, {centered: true});
    modalRef.componentInstance.title = "Are you sure?";
    modalRef.componentInstance.content = "You are about to delete user";
    modalRef.componentInstance.confirmCallback = ()=>{
      this.taskService.delQuote(quote).subscribe({
        next: resp=>{
          this.alertService.emitAlert({
            alertType: "success",
            alertMessage: "delete success!"
          });
          setTimeout(() => {
            this.alertService.emitAlert(null);
          }, 2000);
        },
        error: err=>{
          this.alertService.emitAlert({
            alertType: "warning",
            alertMessage: "delete failed"
          });
          setTimeout(() => {
            this.alertService.emitAlert(null);
          }, 2000);
        }
      })
    }
  }
}
