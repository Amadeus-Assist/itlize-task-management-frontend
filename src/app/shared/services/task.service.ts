import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IQuote } from '../interfaces/iquote';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  quotes: IQuote[];

  constructor(private http: HttpClient) { }


}
