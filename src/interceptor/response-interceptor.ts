import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, switchMap } from 'rxjs';
import { ZodArray, ZodObject, ZodOptional } from 'zod';

@Injectable()
export class ResponseInterceptor<T extends object>
  implements NestInterceptor<any, T>
{
  constructor(
    private readonly schema:
      | ZodOptional<ZodObject<any>>
      | ZodObject<any>
      | ZodArray<ZodObject<any>>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    return next.handle().pipe(
      switchMap(async (data) => {
        const validation = this.schema.safeParse(data);
        if (!validation.success) {
          throw new BadRequestException({
            message: 'Validação da resposta falhou',
            error: validation.error.errors,
          });
        }

        return data;
      }),
    );
  }
}
