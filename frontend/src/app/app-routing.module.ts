import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OnlyAuthenticatedGuard} from "./features/core/guards/only-authenticated.guard";
import {PageNotFoundComponent} from "./features/core/components/page-not-found/page-not-found.component";
import {HomepageComponent} from "./features/core/components/homepage/homepage.component";

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomepageComponent },
  { path: 'game', loadChildren: () => import('./features/game/game.module').then(m => m.GameModule), canActivateChild: [OnlyAuthenticatedGuard] },
  { path: 'user', loadChildren: () => import('./features/user/user.module').then(m => m.UserModule) },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
