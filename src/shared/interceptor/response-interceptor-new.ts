import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Observable, switchMap } from 'rxjs';

@Injectable()
export class ResponseInterceptorNew<T extends object, TClass extends object>
  implements NestInterceptor<any, T>
{
  constructor(private readonly validator: ClassConstructor<TClass>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    return next.handle().pipe(
      switchMap(async (data) => {
        const objectToValidate = plainToInstance(this.validator, data);
        const validation = validateSync(objectToValidate);
        if (validation.length > 0) {
          console.log(JSON.stringify(validation, null, 2));
          throw new InternalServerErrorException({
            message: 'Validação da resposta falhou',
            error: JSON.stringify(validation),
          });
        }
        return data;
      }),
    );
  }
}
