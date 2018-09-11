import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, share} from 'rxjs/operators';
import { Author } from '../../../interfaces/author.interface';
import { Chapter } from '../../../interfaces/chapter.interface';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-chapter',
  templateUrl: './add-chapter.component.html'
})
export class AddChapterComponent implements OnInit {

  forma: FormGroup;

  showSuccess$: Observable<boolean>;
  showError$: Observable<boolean>;

  public currentYear = new Date().getFullYear();

  chapter: Object = {
    title: '',
    book: '',
    pages: '',
    editorial: '',
    year: null,
    authors: []
  };

  public author: any;
  authors: Observable<any[]>;
  authorsNames: Array<string> = [];

  AuthorsColRef: AngularFirestoreCollection<Author>;
  ChaptersColRef: AngularFirestoreCollection<Chapter>;

  constructor(private db: AngularFirestore,
              private router: Router,
              private _authS: AuthService
            ) {

    if ( !this._authS.isUserEmailLoggedIn ) {
      this.router.navigate(['/']);
    }

    this.AuthorsColRef = this.db.collection<Author>('AUTHORS');
    this.ChaptersColRef = this.db.collection<Chapter>('CHAPTERS');

    this.authors = this.db.collection('AUTHORS').valueChanges();

    this.forma = new FormGroup({
      'title':      new FormControl( '', Validators.required ),
      'book':       new FormControl( '', Validators.required ),
      'pages':      new FormControl( '' ),
      'editorial':  new FormControl( '' ),
      'year':       new FormControl( null, [Validators.required,
                                            Validators.min(1990),
                                            Validators.max(this.currentYear)] ),
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

  removeAuthor( i: number ) {
    (<FormArray>this.forma.controls['authors']).removeAt(i);
  }

  saveChapter() {

    const authorList: string[] = this.forma.value.authors;

    const chapter: Chapter = {

      title:      this.forma.value.title,
      book:       this.forma.value.book,
      pages:      this.forma.value.pages,
      editorial:  this.forma.value.editorial,
      year:       this.forma.value.year.toString(),
      author:     this.forma.value.authors.join(' , ')

    };

    this.ChaptersColRef.add(chapter).then((result) => {
      for ( let i = 0; i < authorList.length; i++ ) {
        this.AuthorsColRef.doc(authorList[i]).collection('CHAPTERS').add(chapter);
      }
      this.showSuccess$ = timer(200).pipe( map(() => true), share() );
    })
    .catch((err) => {
      this.showError$ = timer(200).pipe( map(() => true), share() );
    });

    this.forma.reset({
      title: '',
      book: '',
      pages: '',
      editorial: '',
      year: null
    });
    this.forma.controls['authors'].reset();
    while ((<FormArray>this.forma.controls['authors']).length !== 1) {
      (<FormArray>this.forma.controls['authors']).removeAt(0);
    }
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.authorsNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

}
