import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log("erreur intercepte:");
    
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    const status = exception.getStatus ? exception.getStatus() : HttpStatus.BAD_REQUEST;
    const message= exception.message || 'Something went wrong';
    console.log("erreur intercepte:", response);

    return response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: message,
        errorReaponse: exception.cause
      });
  }
}
{
  // response: {
  //   message: 'Cet email est déjà utilisé',
  //   error: 'Not Found',
  //   statusCode: 404
  // },
  // status: 404,
  // options: {}
}