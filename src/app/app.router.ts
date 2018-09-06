import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AddBookComponent } from './components/add/add-book/add-book.component';
import { AddAuthorComponent } from './components/add/add-author/add-author.component';
import { AddChapterComponent } from './components/add/add-chapter/add-chapter.component';

const APP_ROUTES: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'addAuthor', component: AddAuthorComponent },
    { path: 'addBook', component: AddBookComponent },
    { path: 'addChapter', component: AddChapterComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash: true });

