import { Component, OnInit } from '@angular/core';
import { BooksService } from '../../services/books.service';
import { ChaptersService } from '../../services/chapters.service';
import { Book } from '../../interfaces/book.interface';
import { Chapter } from '../../interfaces/chapter.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  Books: Book[] = [];
  Chapters: Chapter[] = [];

  list = false;
  code = false;
  column = true;
  complete = false;

  constructor(  private _booksService: BooksService,
                private _chaptersService: ChaptersService ) {}

  ngOnInit() {
    this.Books  = this._booksService.getBooks();
    this.Chapters = this._chaptersService.getChapters();
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
