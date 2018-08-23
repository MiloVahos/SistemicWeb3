import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Author } from '../../../interfaces/author.interface';
import { Book } from '../../../interfaces/book.interface';


@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html'
})
export class AddBookComponent implements OnInit {

  forma: FormGroup;

  success: boolean;
  danger: boolean;

  book: Object = {
    title: '',
    editorial: '',
    year: '',
    authors: []
  };

  public author: any;
  authors: Observable<any[]>;
  authorsNames: Array<string> = [];

  AuthorsColRef: AngularFirestoreCollection<Author>;
  BooksColRef: AngularFirestoreCollection<Book>;

  constructor(private db: AngularFirestore) {

    this.AuthorsColRef = this.db.collection<Author>('AUTHORS');
    this.BooksColRef = this.db.collection<Book>('BOOKS');

    this.authors = this.db.collection('AUTHORS').valueChanges();

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

    const authors: string = this.forma.value.authors.join(' , ');

    this.BooksColRef.add({
      title:      this.forma.value.title,
      editorial:  this.forma.value.editorial,
      year:       this.forma.value.year,
      author:     authors
    }).then(function(forma) {
      this.forma.reset({
        title: '',
        editorial: '',
        year: '',
        authors: []
      });
    });
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.authorsNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

}
