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
        this.chaptersList.push(chapter);
      });
    });

  }

  getChapters() {
    return this.chaptersList;
  }
}
