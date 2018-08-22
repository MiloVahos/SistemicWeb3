import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BookComponent } from './components/book/book.component';
import { ChapterComponent } from './components/chapter/chapter.component';
import { ConferenceComponent } from './components/conference/conference.component';
import { JournalComponent } from './components/journal/journal.component';
import { PrototypesComponent } from './components/prototypes/prototypes.component';
import { SoftwareComponent } from './components/software/software.component';
import { ThesisComponent } from './components/thesis/thesis.component';
import { AuthorComponent } from './components/author/author.component';
import { AddBookComponent } from './components/add/add-book/add-book.component';
import { AddAuthorComponent } from './components/add/add-author/add-author.component';

const APP_ROUTES: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'book', component: BookComponent },
    { path: 'chapter', component: ChapterComponent },
    { path: 'conference', component: ConferenceComponent },
    { path: 'journal', component: JournalComponent },
    { path: 'prototypes', component: PrototypesComponent },
    { path: 'software', component: SoftwareComponent },
    { path: 'thesis', component: ThesisComponent },
    { path: 'team', component: AuthorComponent },
    { path: 'addAuthor', component: AddAuthorComponent },
    { path: 'addBook', component: AddBookComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash: true });

