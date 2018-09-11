import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, share} from 'rxjs/operators';
import { Author } from '../../../interfaces/author.interface';
import { Prototype } from '../../../interfaces/prototypes.interface';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-prototype',
  templateUrl: './add-prototype.component.html'
})
export class AddPrototypeComponent implements OnInit {

  forma: FormGroup;

  showSuccess$: Observable<boolean>;
  showError$: Observable<boolean>;

  public currentYear = new Date().getFullYear();

  prototype: Object = {
    title: '',
    availability: '',
    institution: '',
    year: null,
    authors: []
  };

  public author: any;
  authors: Observable<any[]>;
  authorsNames: Array<string> = [];

  AuthorsColRef: AngularFirestoreCollection<Author>;
  PrototypeColRef: AngularFirestoreCollection<Prototype>;

  constructor(private db: AngularFirestore,
              private router: Router,
              private _authS: AuthService
            ) {

    if ( !this._authS.isUserEmailLoggedIn ) {
      this.router.navigate(['/']);
    }

    this.AuthorsColRef = this.db.collection<Author>('AUTHORS');
    this.PrototypeColRef = this.db.collection<Prototype>('PROTOTYPES');

    this.authors = this.db.collection('AUTHORS').valueChanges();

    this.forma = new FormGroup({
      'title':    new FormControl( '', Validators.required ),
      'availability':   new FormControl( '', Validators.required ),
      'institution':   new FormControl( '', Validators.required ),
      'year':     new FormControl( null, [Validators.required,
                                            Validators.min(1990),
                                            Validators.max(this.currentYear)] ),
      'authors':  new FormArray([ new FormControl('', Validators.required ) ])
    });
  }

  savePrototype() {

    const authorList: string[] = this.forma.value.authors;

    const prototype: Prototype = {

      title:        this.forma.value.title,
      availability: this.forma.value.availability,
      institution:  this.forma.value.institution,
      year:         this.forma.value.year.toString(),
      author:       this.forma.value.authors.join(' , ')

    };

    this.PrototypeColRef.add(prototype).then((result) => {
      for ( let i = 0; i < authorList.length; i++ ) {
        this.AuthorsColRef.doc(authorList[i]).collection('PROTOTYPE').add(prototype);
      }
      this.showSuccess$ = timer(200).pipe( map(() => true), share() );
    })
    .catch((err) => {
      this.showError$ = timer(200).pipe( map(() => true), share() );
    });

    this.forma.reset({
      title: '',
      availability: '',
      institution: '',
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

