import { Component, OnInit } from '@angular/core';
import { Author } from '../../interfaces/author.interface';
import { Book } from '../../interfaces/book.interface';
import { Chapter } from '../../interfaces/chapter.interface';
import { Conference } from '../../interfaces/conference.interface';
import { Journal } from '../../interfaces/journal.interface';
import { Thesis } from '../../interfaces/thesis.interface';
import { Prototype } from '../../interfaces/prototypes.interface';
import { Software } from '../../interfaces/software.interface';
import { AuthorsService } from '../../services/authors.service';
import { BooksService } from '../../services/books.service';
import { ChaptersService } from '../../services/chapters.service';
import { ConferencesService } from '../../services/conferences.service';
import { JournalsService } from '../../services/journals.service';
import { SoftwareService } from '../../services/software.service';
import { PrototypesService } from '../../services/prototypes.service';
import { ThesisService } from '../../services/thesis.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  Authors:      Author[]      = [];
  Books:        Book[]        = [];
  Chapters:     Chapter[]     = [];
  Conferences:  Conference[]  = [];
  Journals:     Journal[]     = [];
  Software:     Software[]    = [];
  Prototypes:   Prototype[]   = [];
  Thesis:       Thesis[]      = [];

  documents = [ { doc: 'Any', type: 'any' },
                { doc: 'Books', type: 'book' },
                { doc: 'Books Chapters', type: 'chapter' },
                { doc: 'Journal Articles', type: 'journal' },
                { doc: 'Conference Articles', type: 'conference' },
                { doc: 'Thesis', type: 'thesis' },
                { doc: 'Software', type: 'software' },
                { doc: 'Prototypes', type: 'prototype' }];

  docSelected = 'any';

  list = true;
  code = false;
  column = false;
  complete = false;
  logged = false;

  constructor(  private _booksService: BooksService,
                private _chaptersService: ChaptersService,
                private _authorsService: AuthorsService,
                private _conferencesService: ConferencesService,
                private _journalsService: JournalsService,
                private _softwareService: SoftwareService,
                private _prototypesService: PrototypesService,
                private _thesisService: ThesisService,
                public _authS: AuthService ) {

    setTimeout ( () => {
      if ( this._authS.isUserEmailLoggedIn ) {
        this.logged = true;
      } else {
        this.logged = false;
      }
    }, 1500);

  }

  ngOnInit() {
    if ( this.Authors.length === 0 ) {
      this.Authors  = this._authorsService.getAuthors();
    } else {
      this.Authors.length  = 0;
      this.Authors  = this._authorsService.getAuthors();
    }
    if ( this.Books.length === 0 ) {
      this.Books  = this._booksService.getBooks();
    } else {
      this.Books.length  = 0;
      this.Books  = this._booksService.getBooks();
    }
    if ( this.Chapters.length === 0 ) {
      this.Chapters  = this._chaptersService.getChapters();
    } else {
      this.Chapters.length  = 0;
      this.Chapters  = this._chaptersService.getChapters();
    }
    if ( this.Conferences.length === 0 ) {
      this.Conferences  = this._conferencesService.getConferences();
    } else {
      this.Conferences.length  = 0;
      this.Conferences  = this._conferencesService.getConferences();
    }
    if ( this.Journals.length === 0 ) {
      this.Journals  = this._journalsService.getJournals();
    } else {
      this.Journals.length  = 0;
      this.Journals  = this._journalsService.getJournals();
    }
    if ( this.Prototypes.length === 0 ) {
      this.Prototypes  = this._prototypesService.getPrototypes();
    } else {
      this.Prototypes.length  = 0;
      this.Prototypes  = this._prototypesService.getPrototypes();
    }
    if ( this.Software.length === 0 ) {
      this.Software  = this._softwareService.getSoftware();
    } else {
      this.Software.length  = 0;
      this.Software  = this._softwareService.getSoftware();
    }
    if ( this.Thesis.length === 0 ) {
      this.Thesis  = this._thesisService.getThesis();
    } else {
      this.Thesis.length  = 0;
      this.Thesis  = this._thesisService.getThesis();
    }
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

  logout() {
    this._authS.signOut();
    this.logged = false;
  }

}
