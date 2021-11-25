import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StoreModule} from "@ngrx/store";
import * as fromCoreState from "./store/core.reducer";
import {EffectsModule} from "@ngrx/effects";
import {CoreEffects} from "./store/core.effects";
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import {OnlyAuthenticatedGuard} from "./guards/only-authenticated.guard";
import { HomepageComponent } from './components/homepage/homepage.component';



@NgModule({
  declarations: [
    PageNotFoundComponent,
    HomepageComponent
  ],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromCoreState.coreStateFeatureKey, fromCoreState.reducers, { metaReducers: fromCoreState.metaReducers }),
    EffectsModule.forFeature([CoreEffects]),
  ],
  providers: [
    OnlyAuthenticatedGuard
  ]
})
export class CoreModule { }
