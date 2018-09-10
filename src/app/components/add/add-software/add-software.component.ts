import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, share} from 'rxjs/operators';
import { Author } from '../../../interfaces/author.interface';
import { Software } from '../../../interfaces/software.interface';

@Component({
  selector: 'app-add-software',
  templateUrl: './add-software.component.html'
})
export class AddSoftwareComponent implements OnInit {

  forma: FormGroup;

  showSuccess$: Observable<boolean>;
  showError$: Observable<boolean>;

  public currentYear = new Date().getFullYear();

  software: Object = {
    title: '',
    name: '',
    availability: '',
    institution: '',
    year: null,
    authors: []
  };

  public author: any;
  authors: Observable<any[]>;
  authorsNames: Array<string> = [];

  AuthorsColRef: AngularFirestoreCollection<Author>;
  SoftwareColRef: AngularFirestoreCollection<Software>;

  constructor(private db: AngularFirestore) {

    this.AuthorsColRef = this.db.collection<Author>('AUTHORS');
    this.SoftwareColRef = this.db.collection<Software>('SOFTWARE');

    this.authors = this.db.collection('AUTHORS').valueChanges();

    this.forma = new FormGroup({
      'title':    new FormControl( '', Validators.required ),
      'name':  new FormControl( '', Validators.required ),
      'availability':   new FormControl( '', Validators.required ),
      'institution':   new FormControl( '', Validators.required ),
      'year':     new FormControl( null, [Validators.required,
                                            Validators.min(1990),
                                            Validators.max(this.currentYear)] ),
      'authors':  new FormArray([ new FormControl('', Validators.required ) ])
    });
  }

  saveSoftware() {

    const authorList: string[] = this.forma.value.authors;

    const software: Software = {

      title:        this.forma.value.title,
      name:         this.forma.value.name,
      availability: this.forma.value.availability,
      institution:  this.forma.value.institution,
      year:         this.forma.value.year.toString(),
      author:       this.forma.value.authors.join(' , ')

    };

    this.SoftwareColRef.add(software).then((result) => {
      for ( let i = 0; i < authorList.length; i++ ) {
        this.AuthorsColRef.doc(authorList[i]).collection('SOFTWARE').add(software);
      }
      this.showSuccess$ = timer(200).pipe( map(() => true), share() );
    })
    .catch((err) => {
      this.showError$ = timer(200).pipe( map(() => true), share() );
    });

    this.forma.reset({
      title: '',
      name: '',
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
