import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'takeoutd'
})
export class TakeoutdPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
