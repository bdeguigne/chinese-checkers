import { Catch, ArgumentsHost } from '@nestjs/common';

import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(WsException)
export class AllExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    super.catch(exception, host);
  }
}
