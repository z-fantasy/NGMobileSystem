import { Injectable } from '@angular/core';

@Injectable()
export class UtilFunService {

  constructor() { }
  dateTimeGet(time: any): string {
    const d = new Date(time);
    return d.getFullYear() + '-' + (d.getMonth() + 1 >= 10 ? d.getMonth() + 1 : '0' + d.getMonth() + 1) + '-' + (d.getDate() >= 10 ? d.getDate() : '0' + d.getDate()) + ' ' + (d.getHours() >= 10 ? d.getHours() : '0' + d.getHours()) + ':' + (d.getMinutes() >= 10 ? d.getMinutes() : '0' + d.getMinutes()) + ':' + (d.getSeconds() >= 10 ? d.getSeconds() : '0' + d.getSeconds());
  }
  overHerfDate(date: any): string {
    return date.replace(/00:00:00/, '12:00:00');
  }
}
