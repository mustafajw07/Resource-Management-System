import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from "./footer/footer.component";
import { Store } from '@ngrx/store';
import { ReferenceDataService } from '@core/services/reference-data.service';
import { toast } from 'ngx-sonner';
import { addReferenceData } from '../store/reference-data/reference-data.action';
import { ReferenceRow } from '@core/interfaces/reference-row';

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

  ngOnInit(): void {
    this.getReferenceData();
  }

  /**
   * Fetch reference data and update the store
   * @returns void
   */
  getReferenceData(): void {
     this.referenceDataService.getAll().subscribe({
      next: (data: ReferenceRow[]) => {
        this.store.dispatch(addReferenceData({ referenceData: data }));
      },
      error: (err) => {
        const message = err?.error?.message ?? err?.message ?? 'Failed to load reference data';
        toast.error(message, { duration: 3000 });
      }
    });
  }
}

