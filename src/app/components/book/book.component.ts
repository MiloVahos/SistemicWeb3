import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Book } from '../../interfaces/book.interface';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  list = false;
  code = false;
  column = true;
  complete = false;

  books: Observable<any[]>;
  bookList: Book[] = [];

  constructor(db: AngularFirestore) {
    this.books = db.collection('BOOKS').valueChanges();
  }

  ngOnInit() {

    this.books.subscribe(books => {
      books.forEach(book =>  {
        this.bookList.push(book);
      });
    });

  }

  listView() {
    this.list = true;
    this.code = false;
    this.column = false;
  }

  columsView() {
    this.list = false;
    this.code = false;
    this.column = true;
  }

  codeView() {
    this.list = false;
    this.code = true;
    this.column = false;
  }

}
