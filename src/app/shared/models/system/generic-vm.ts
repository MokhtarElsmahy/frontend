import { ResponseStatusEnum } from './response-status.enum';
import { Message } from './message';

export class GenericVm<T> {
     data: T;

     messages: Message[];

     status: ResponseStatusEnum;
     dataLength:number;
}
