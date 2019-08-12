import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  @Input() currentPage: any;
  @Input() totalPage: any;
  @Output() changePage: EventEmitter<any> = new EventEmitter();

  constructor() { }


  ngOnInit() {
  }

  goToPage(value) {
    const self = this;
    if (value === self.totalPage && self.currentPage === self.totalPage || value === 1 && self.currentPage === 1)
      return;
    if (value <= self.totalPage && value > 0) {
      self.changePage.emit(value);
    }
  }
}
