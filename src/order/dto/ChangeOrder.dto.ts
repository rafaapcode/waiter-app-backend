import { IsEnum } from 'class-validator';
import { STATUS } from 'src/types/Order.type';

export class ChangeOrderDTO {
  @IsEnum(STATUS, {
    message:
      'O novo status deve ser um desses:  WAITING | IN_PRODUCTION | DONE',
  })
  status: STATUS;
}
