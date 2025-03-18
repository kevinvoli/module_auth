// import {Injectable, CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
// import { Observable } from "rxjs";
// import {map} from 'rxjs/operators'
// // import { Response } from 'express';


// export interface Response<T>{
//   message: string,
//   success: boolean,
//   result: any,
//   timeStamps: Date,
//   statusCode: number ,
//   path: string
//   error:null,
// }
//  export class TransformationInterceptor<T>
//  implements NestInterceptor<T, Response<T>>{
//   intercept(
//     context: ExecutionContext, 
//     next: CallHandler): 
//     Observable<Response<T>>{
// console.log("je suis encore eter response")

//       let i=0    
//     const statusCode = context.switchToHttp().getResponse().statuscode;
//     const path = context.switchToHttp().getResponse().url;
// console.log("je suis encore ici",i+1)

//       const response=  next.handle().pipe(
//         map((data)=>({
//           message: data.message,
//           success: data.success,
//           result: data,
//           timeStamps: new Date(),
//           statusCode,
//           path,
//           error:null
//         }))
//       )
//       return response
//   }
//  }