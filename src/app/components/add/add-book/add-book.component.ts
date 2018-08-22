import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html'
})
export class AddBookComponent implements OnInit {

  forma: FormGroup;

  success: boolean;
  danger: boolean;

  book: Object = {
    title: null,
    editorial: null,
    year: null,
    authors: []
  };

  public author: any;
  authors: Observable<any[]>;
  authorsNames: Array<string> = [];

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.authorsNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  constructor(db: AngularFirestore) {

    this.authors = db.collection('AUTHORS').valueChanges();

    this.forma = new FormGroup({
      'title':      new FormControl( '', Validators.required ),
      'editorial':  new FormControl( '', Validators.required ),
      'year':       new FormControl( '', Validators.required ),
      'authors':    new FormArray([ new FormControl('', Validators.required ) ])
    });
    
  }

  ngOnInit() {

    this.authors.subscribe(authors => {
      authors.forEach(author => {
        this.authorsNames.push(author.name);
      });
    });

  }


  addAuthor() {
    (<FormArray>this.forma.controls['authors']).push(
      new FormControl('', Validators.required)
    );
  }

  saveBook() {
    console.log(this.book);
    this.forma.reset();
  }

}
