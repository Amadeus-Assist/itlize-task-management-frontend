import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { IQuote } from '../interfaces/iquote';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  quotes: IQuote[] = [];
  quoteEmitter: EventEmitter<IQuote[]> = new EventEmitter();
  pageSize:number = 5;
  sortKey:string = "QuoteID";
  isDec:boolean = false;
  filterKey:string = "";
  pageIndex: number = 0;

  constructor(private http: HttpClient, private accountService: AccountService, private rtr: Router) { }

  getQuoteIndex(id: number) {
    let idx = -1;
    for (let i = 0; i < this.quotes.length; i++) {
      if (this.quotes[i].QuoteID == id) {
        idx = i;
        break;
      }
    }
    return idx;
  }

  getAllQuotes() {
    console.log("get all quotes called");
    if (this.quotes && this.quotes.length) {
      this.quoteEmitter.emit(this.quotes);
      return;
    }
    this.http.get<IQuote[]>("api/quote", {
      headers: {
        "Authorization": this.accountService.getCredential()?.token
      }
    }).subscribe({
      next: resp => {
        this.quotes = resp;
        this.quoteEmitter.emit(this.quotes);
      },
      error: err => {
        this.rtr.navigate(["error"]);
      }
    });
  }

  getAllQuotesFromDB() {
    this.http.get<IQuote[]>("api/quote", {
      headers: {
        "Authorization": this.accountService.getCredential()?.token
      }
    }).subscribe({
      next: resp => {
        this.quotes = resp;
        this.quoteEmitter.emit(this.quotes);
      },
      error: err => {
        this.rtr.navigate(["error"]);
      }
    });
  }

  findQuoteById(id: number) {
    const idx = this.getQuoteIndex(id);
    if (idx<0) {
      return null;
    }
    return this.quotes[idx];
  }

  addQuote(quote: IQuote) {
    return this.http.post<IQuote>("api/quote", quote, {
      headers: {
        "Authorization": this.accountService.getCredential()?.token,
        'Content-Type': 'application/json'
      }
    }).pipe(
      tap(resp => {
        this.quotes.push(resp);
        this.quoteEmitter.emit(this.quotes);
      })
    );
  }

  editQuote(quote: IQuote) {
    return this.http.put<IQuote>(`api/quote/${quote.QuoteID}`, quote, {
      headers: {
        "Authorization": this.accountService.getCredential()?.token,
        'Content-Type': 'application/json'
      }
    }).pipe(
      tap(resp => {
        const idx = this.getQuoteIndex(quote.QuoteID);
        if (idx < 0) {
          this.getAllQuotesFromDB();
        }else {
          this.quotes[idx] = quote;
          this.quoteEmitter.emit(this.quotes);
        }
      })
    );
  }

  delQuote(quote: IQuote) {
    return this.http.delete<IQuote>(`api/quote/${quote.QuoteID}`, {
      headers: {
        "Authorization": this.accountService.getCredential()?.token
      }
    }).pipe(tap(resp => {
      const idx = this.getQuoteIndex(quote.QuoteID);
        if (idx < 0) {
          this.getAllQuotesFromDB();
        }else {
          this.quotes.splice(idx, 1);
          console.log(this.quotes);
          this.quoteEmitter.emit(this.quotes);
        }
    }));
  }

  clear() {
    this.sortKey = "QuoteID";
    this.quotes = [];
    this.pageSize = 5;
    this.pageIndex = 0;
    this.isDec = false;
    this.filterKey = "";
  }
}
