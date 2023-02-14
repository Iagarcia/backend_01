import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { getReasonPhrase }from 'http-status-codes';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        status: status,
        send: getReasonPhrase(status),
        data: {
            timestamp: new Date().toISOString(),
            path: request.url,
            message: exception.message
        }
      });
  }
}