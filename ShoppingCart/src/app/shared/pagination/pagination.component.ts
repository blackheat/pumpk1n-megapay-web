import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  @Input() currentPage;
  @Input() totalPage;
  @Output() changePage: EventEmitter<any> = new EventEmitter();
  constructor() { }

  goToPage(value) {
    const self = this;
    self.changePage.emit(value);
  }

  ngOnInit() {
  }

}
