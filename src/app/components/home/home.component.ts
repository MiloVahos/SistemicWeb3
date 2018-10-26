/**
 * Developer: Juan Camilo Peña Vahos
 * LastUpdate: 23/10/2018
 */

import { Component } from '@angular/core';
import { Book } from '../../interfaces/book.interface';
import { Chapter } from '../../interfaces/chapter.interface';
import { Conference } from '../../interfaces/conference.interface';
import { Journal } from '../../interfaces/journal.interface';
import { Thesis } from '../../interfaces/thesis.interface';
import { Prototype } from '../../interfaces/prototypes.interface';
import { Software } from '../../interfaces/software.interface';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {

  private BooksCol: AngularFirestoreCollection<Book>;
  public  BooksObs: Observable<Book[]>;
  private ChaptersCol: AngularFirestoreCollection<Chapter>;
  public  ChaptersObs: Observable<Chapter[]>;
  private ConferencesCol: AngularFirestoreCollection<Conference>;
  public  ConferencesObs: Observable<Conference[]>;
  private JournalsCol: AngularFirestoreCollection<Journal>;
  public  JournalsObs: Observable<Journal[]>;
  private PrototypesCol: AngularFirestoreCollection<Prototype>;
  public  PrototypesObs: Observable<Prototype[]>;
  private SoftwaresCol: AngularFirestoreCollection<Software>;
  public  SoftwaresObs: Observable<Software[]>;
  private ThesissCol: AngularFirestoreCollection<Thesis>;
  public  ThesissObs: Observable<Thesis[]>;

  documents = [ { doc: 'Any', type: 'any' },
                { doc: 'Books', type: 'book' },
                { doc: 'Books Chapters', type: 'chapter' },
                { doc: 'Journal Articles', type: 'journal' },
                { doc: 'Conference Articles', type: 'conference' },
                { doc: 'Thesis', type: 'thesis' },
                { doc: 'Software', type: 'software' },
                { doc: 'Prototypes', type: 'prototype' }];

  docSelected = 'any';
  // Filtros generales
  searchYear = '';
  searchTitle = '';
  searchAuthor = '';
  // Filtros para journals
  searchJournal = '';
  searchColciencias = '';
  searchSjr = '';
  // Filtros para conferences
  searchConference = '';
  // Filtros para thesis
  searchType = '';

  list = true;
  code = false;
  column = false;
  complete = false;
  logged = false;

  constructor(  db: AngularFirestore,
                public _authS: AuthService,
                private cookieService: CookieService ) {

    this.BooksCol = db.collection<Book>('BOOKS');
    this.BooksObs = this.BooksCol.valueChanges();
    this.ChaptersCol = db.collection<Chapter>('CHAPTERS');
    this.ChaptersObs = this.ChaptersCol.valueChanges();
    this.ConferencesCol = db.collection<Conference>('CONFERENCES');
    this.ConferencesObs = this.ConferencesCol.valueChanges();
    this.JournalsCol = db.collection<Journal>('JOURNALS');
    this.JournalsObs = this.JournalsCol.valueChanges();
    this.PrototypesCol = db.collection<Prototype>('PROTOTYPES');
    this.PrototypesObs = this.PrototypesCol.valueChanges();
    this.SoftwaresCol = db.collection<Software>('SOFTWARE');
    this.SoftwaresObs = this.SoftwaresCol.valueChanges();
    this.ThesissCol = db.collection<Thesis>('THESIS');
    this.ThesissObs = this.ThesissCol.valueChanges();

    setTimeout ( () => {
      if ( this._authS.isUserEmailLoggedIn ) {
        this.logged = true;
      } else {
        this.logged = false;
      }
    }, 1500);

    this.cookieService.deleteAll();

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
