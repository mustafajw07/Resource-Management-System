import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from "./footer/footer.component";
import { Store } from '@ngrx/store';
import { ReferenceDataService } from '@core/services/reference-data.service';
import { ReferenceDataActions } from '../store/reference-data/reference-data.action';
import { selectStatus, selectError, selectCategoryByName, selectReferenceDataState } from '../store/reference-data/reference-data.selectors';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  private store = inject(Store);
  private referenceDataService = inject(ReferenceDataService);

  readonly categoryName = 'Skills';

  status$ = this.store.select(selectStatus);
  error$ = this.store.select(selectError);
  category$ = this.store.select(selectCategoryByName(this.categoryName));

  ngOnInit(): void {

    this.store.dispatch(ReferenceDataActions.load());

    this.referenceDataService.getAll().subscribe({
      next: (rows) => {
        this.store.dispatch(ReferenceDataActions.loadSuccess({ rows }));
      },
      error: (err) => {
        const message = err?.error?.message ?? err?.message ?? 'Failed to load reference data';
        this.store.dispatch(ReferenceDataActions.loadFailure({ error: message }));
      }
    });
 
 this.store.select(selectReferenceDataState).subscribe(state => {
    console.log('Current Store State:', state);
  });
}}

