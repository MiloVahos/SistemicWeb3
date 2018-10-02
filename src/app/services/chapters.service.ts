import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Chapter } from '../interfaces/chapter.interface';

@Injectable({
  providedIn: 'root'
})
export class ChaptersService {

  private chaptersList: Chapter[] = [];
  private chapters: Observable<any[]>;

  constructor(db: AngularFirestore) {

    this.chapters = db.collection('CHAPTERS').valueChanges();

    this.chapters.subscribe(chapters => {
      chapters.forEach(chapter =>  {
        let flag = 0;
        for ( let i = 0; i < this.chaptersList.length; i++ ) {
          if ( this.chaptersList[i].id === chapter.id ) {
            flag++;
          }
        }
        if ( flag === 0 ) {
          this.chaptersList.push(chapter);
        }
      });
    });

  }

  getChapters() {
    return this.chaptersList;
  }
}
