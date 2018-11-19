import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observer } from 'rxjs';
@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: [ './loading-spinner.component.css' ]
})
export class LoadingSpinnerComponent implements OnInit, OnChanges {
  @Input() isShowing: boolean;

  constructor(private spinner: NgxSpinnerService) {}

  ngOnInit() {
    const self = this;
    self.spinner.show();
  }

  ngOnChanges() {
    const self = this;
    if (self.isShowing) {
      self.spinner.show();
    } else {
      self.spinner.hide();
    }
  }
}
