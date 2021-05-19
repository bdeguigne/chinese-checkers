import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UniqueIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    value.id = uuidv4();
    return value;
  }
}
