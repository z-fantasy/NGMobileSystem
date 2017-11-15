import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-scroll-select',
  templateUrl: './scroll-select.component.html',
  styleUrls: ['./scroll-select.component.css']
})
export class ScrollSelectComponent implements OnInit, AfterViewInit {
  @Input() size = 'default';
  isOpen = false;
  @Input() selectList = []; // 数据数组
  @Input() selectValue; // 初始值
  @Output() checkedSele: EventEmitter<number> = new EventEmitter();
  constructor(private el: ElementRef) {
  }

  ngOnInit() {
    if (!this.selectValue) {
      this.selectValue = this.selectList[0];
    }
  }
  ngAfterViewInit() {
    if (this.selectValue) {
      for (let i = 0; i < this.selectList.length; i++) {
        if (this.selectList[i].label === this.selectValue.label) {
          const ele = this.el.nativeElement.querySelectorAll('li');
          ele[i].style.fontWeight = 'bold';
          ele[i].style.background = '#f7f7f7';
        }
      }
    }
  }
  openSlect() {
    this.isOpen = !this.isOpen;
  }

  closePanel() {
    this.isOpen = false;
  }

  checkIt(e: any, item: any) {
    if (item.value !== this.selectValue.value) {
      this.checkedSele.emit(item);
      const ele = this.el.nativeElement.querySelectorAll('li');
      for (let i = 0; i < ele.length; i++) {
        ele[i].style.fontWeight = 'normal';
        ele[i].style.background = '000';
      }
      e.target.style.fontWeight = 'bold';
      e.target.style.background = '#f7f7f7';
      this.selectValue = item;
    }
    this.closePanel();
  }
}
