import { Component, OnInit } from '@angular/core';
import { Book } from '../../../interfaces/book.interface';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {

  book: Book = {
    title: 'Book without title',
    editorial: 'Book without editorial',
    year: 'Book without year',
    author: 'Book without authors'
  }

  constructor() { }

  ngOnInit() {
  }

}
