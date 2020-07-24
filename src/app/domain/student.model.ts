import {Answer} from './answer.model';

export class Student {
  id: string;
  name: string;
  connection: string;
  currPage: number;
  answers: Answer[];
}
