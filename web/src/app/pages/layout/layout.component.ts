import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { HeaderComponent } from "./header/header.component";

@Component({
  selector: 'app-layout',
  imports: [SharedModule, HeaderComponent],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {

}
