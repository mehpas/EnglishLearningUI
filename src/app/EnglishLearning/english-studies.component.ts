import { Component } from '@angular/core';
import { TranslatePipe } from '../pipes/translate.pipe';

@Component({
  selector: 'app-english-studies',
  imports: [TranslatePipe],
  templateUrl: './english-studies.component.html',
  styleUrls: ['./english-studies.component.scss']
})
export class EnglishStudiesComponent {}
