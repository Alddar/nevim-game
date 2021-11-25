import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GameCreateOrJoinComponent} from "../game/components/create/game-create-or-join.component";
import {UserCreateComponent} from "./create/user-create.component";

const routes: Routes = [
  { path: 'create', component: UserCreateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
