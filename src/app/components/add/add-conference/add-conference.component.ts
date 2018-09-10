import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, share} from 'rxjs/operators';
import { Author } from '../../../interfaces/author.interface';
import { Conference } from '../../../interfaces/conference.interface';

@Component({
  selector: 'app-add-conference',
  templateUrl: './add-conference.component.html'
})
export class AddConferenceComponent implements OnInit {

  forma: FormGroup;

  showSuccess$: Observable<boolean>;
  showError$: Observable<boolean>;

  public currentYear = new Date().getFullYear();

  conference: Object = {
    title: '',
    conference: '',
    pages: '',
    url: '',
    ambit: '',
    year: null,
    authors: []
  };

  public author: any;
  authors: Observable<any[]>;
  authorsNames: Array<string> = [];

  AuthorsColRef: AngularFirestoreCollection<Author>;
  ConferencesColRef: AngularFirestoreCollection<Conference>;

  constructor(private db: AngularFirestore) {

    this.AuthorsColRef = this.db.collection<Author>('AUTHORS');
    this.ConferencesColRef = this.db.collection<Conference>('CONFERENCES');

    this.authors = this.db.collection('AUTHORS').valueChanges();

    this.forma = new FormGroup({
      'title':    new FormControl( '', Validators.required ),
      'conference':  new FormControl( '', Validators.required ),
      'pages':    new FormControl( '' ),
      'url':      new FormControl( '' ),
      'ambit':   new FormControl( '' ),
      'year':     new FormControl( null, [Validators.required,
                                            Validators.min(1990),
                                            Validators.max(this.currentYear)] ),
      'authors':  new FormArray([ new FormControl('', Validators.required ) ])
    });
  }

  saveConference() {

    const authorList: string[] = this.forma.value.authors;

    const conference: Conference = {

      title:    this.forma.value.title,
      conference:  this.forma.value.conference,
      pages:    this.forma.value.pages,
      url:      this.forma.value.url,
      ambit:   this.forma.value.ambit,
      year:     this.forma.value.year.toString(),
      author:   this.forma.value.authors.join(' , ')

    };

    this.ConferencesColRef.add(conference).then((result) => {
      for ( let i = 0; i < authorList.length; i++ ) {
        this.AuthorsColRef.doc(authorList[i]).collection('CONFERENCES').add(conference);
      }
      this.showSuccess$ = timer(200).pipe( map(() => true), share() );
    })
    .catch((err) => {
      this.showError$ = timer(200).pipe( map(() => true), share() );
    });

    this.forma.reset({
      title: '',
      conference: '',
      pages: '',
      url: '',
      ambit: '',
      year: null
    });
    this.forma.controls['authors'].reset();
    while ((<FormArray>this.forma.controls['authors']).length !== 1) {
      (<FormArray>this.forma.controls['authors']).removeAt(0);
    }
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

  removeAuthor( i: number ) {
    (<FormArray>this.forma.controls['authors']).removeAt(i);
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.authorsNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

}

