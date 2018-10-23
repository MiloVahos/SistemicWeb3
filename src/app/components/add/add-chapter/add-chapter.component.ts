import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, share} from 'rxjs/operators';
import { Chapter } from '../../../interfaces/chapter.interface';
import { AuthService } from '../../../services/auth.service';
import { AuthorsService } from '../../../services/authors.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-chapter',
  templateUrl: './add-chapter.component.html'
})
export class AddChapterComponent implements OnInit {

  forma: FormGroup;                   // OBJETO MODIFICADOR DEL FORMULARIO
  showSuccess$: Observable<boolean>;  // SI SE COMPLETA UNA TRANSFERENCIA SE ACTIVA ESTA BANDERA
  showError$: Observable<boolean>;    // SI LA TRANSFERENCIA FALLA, SE ACTIVA ESTA BANDERA
  updateMode = false;                 // MODO UPDATE ACTIVADO
  private updatedID: string;          // ID QUE SE VA A MODIFICAR
  private deleteID: string;           // ID QUE SE VA A ELIMINAR
  deleteTitle: string;                // TITULO DEL LIBRO QUE SE VA A BORRAR

  // VARIABLES
  public currentYear = new Date().getFullYear();  // AÑO ACTUAL
  closeResult: string;

  // VARIABLES DE LA BASE DE DATOS
  private ChaptersCol: AngularFirestoreCollection<Chapter>;
  public  ChaptersObs: Observable<Chapter[]>;
  private ChaptersList: Chapter[]  = [];
  private AuthorsNames: Array<string> = [];

  constructor(  private router: Router,
                private _authS: AuthService,
                private _authorsService: AuthorsService,
                private db: AngularFirestore,
                private modalService: NgbModal
            ) {

    if ( !this._authS.isUserEmailLoggedIn ) {
      this.router.navigate(['/']);
    }

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

    this.ChaptersCol = db.collection<Chapter>('CHAPTERS');
    this.ChaptersObs = this.ChaptersCol.valueChanges();

  }

  ngOnInit() {
    this.AuthorsNames  = this._authorsService.getAuthorsNames();
    this.ChaptersObs.subscribe( chapters => {
      chapters.forEach( chapter =>  {
        this.ChaptersList.push(chapter);
      });
    });
  }

  saveChapter() {

    const ID = this.getUniqueId();
    const chapter: Chapter = {
      id:         ID,
      title:      this.forma.value.title,
      book:       this.forma.value.book,
      pages:      this.forma.value.pages,
      editorial:  this.forma.value.editorial,
      year:       this.forma.value.year.toString(),
      author:     this.forma.value.authors.join(' , ')
    };

    this.ChaptersCol.doc(ID).set(chapter).then( (result) => {
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

  // UPDATE
  updateChapter ( chapter: Chapter ) {

    this.forma.reset({
      title:      chapter.title,
      book:       chapter.book,
      pages:      chapter.pages,
      editorial:  chapter.editorial,
      year:       chapter.year
    });

    const authors: string[] = chapter.author.split(' , ');
    for ( let i = 0; i < authors.length; i++ ) {
      (<FormArray>this.forma.controls['authors']).push(
        new FormControl( authors[i], Validators.required )
      );
    }
    (<FormArray>this.forma.controls['authors']).removeAt(0);
    this.updatedID  = chapter.id;
    this.updateMode = true;
  }

  update() {
    if ( this.updateMode ) {
      const chapter: Chapter = {
        id:         this.updatedID,
        title:      this.forma.value.title,
        book:       this.forma.value.book,
        pages:      this.forma.value.pages,
        editorial:  this.forma.value.editorial,
        year:       this.forma.value.year.toString(),
        author:     this.forma.value.authors.join(' , ')
      };
      this.ChaptersCol.doc(this.updatedID).update(chapter);
    }
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
    this.updatedID  = '';
    this.updateMode = false;
  }

  // DELETE
  deleteChapter ( chapter: Chapter, content ) {
    this.deleteID = chapter.id;
    this.deleteTitle = chapter.title;
    this.modalService.open( content, { ariaLabelledBy: 'modal-basic-title' } )
      .result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  delete() {
    this.ChaptersCol.doc(this.deleteID).delete();
    this.deleteID  = '';
    this.deleteTitle  = '';
    this.modalService.dismissAll(this.closeResult);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }



  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.AuthorsNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  addAuthor() {
    (<FormArray>this.forma.controls['authors']).push(
      new FormControl('', Validators.required)
    );
  }

  removeAuthor( i: number ) {
    (<FormArray>this.forma.controls['authors']).removeAt(i);
  }

  getUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9) + (new Date()).getTime().toString(36);
  }

}
