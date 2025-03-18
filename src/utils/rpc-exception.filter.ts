import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException, HttpException)
export class RpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException | HttpException, host: ArgumentsHost) {
    let errorResponse: any = { message: 'Une erreur est survenue', statusCode: 500 };

    if (exception instanceof HttpException) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();
      console.log("Filtre erreur HTTP:", exception);

      errorResponse = {
        message: exception.message || "Erreur du serveur",
        status: exception.getStatus ? exception.getStatus() : HttpStatus.BAD_REQUEST,
        timestamp: new Date().toISOString(),
        path: request.url,
        errorResponse: exception.getResponse(),
      };

      response.status(errorResponse.status).json(errorResponse);
    } 
    else if (exception instanceof RpcException) {
      console.log("Filtre erreur RPC:", exception);

      // Extraire l'erreur encapsulée dans `RpcException`
      const error = exception['error']; // Contient l'exception d'origine (ConflictException)
      if (error instanceof HttpException) {
        errorResponse = {
          message: error.message,
          status: error.getStatus(),
          timestamp: new Date().toISOString(),
          errorResponse: error.getResponse(),
        };
      } else {
        errorResponse = {
          message: exception.message || "Erreur interne du serveur",
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          timestamp: new Date().toISOString(),
        };
      }
    }

    console.error("Exception capturée:", errorResponse);
    return errorResponse;
  }
}
