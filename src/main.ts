import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClientProxyFactory, MicroserviceOptions, Transport } from '@nestjs/microservices';
import axios from 'axios';
import * as net from 'net';
import * as os from 'os'
import { ValidationPipe } from '@nestjs/common';
import { TransformationInterceptor } from './responseInterceptor';


function getLocalIPAddress(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address; // Retourne la première adresse IPv4 non interne
      }
    }
  }
  return '127.0.0.1'; // Adresse de repli si aucune adresse n'est trouvée
}


async function bootstrap() {
  const host = getLocalIPAddress()
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: host,
      port: 3013, // Port for NestJS service
    },
  });

  const serviceName = 'authService';
  const port = '3013'; // Choose a different port

  // Register with Gateway (assuming Gateway listens on port 3003)
  try {
     await axios.post('http://172.26.112.1:3003/discovery/register', {
      nom: serviceName,
      host: host,
      port: port,
      protocole: 'tcp',
      cleApi:"sdfdfty,nfbdsqdfghtyj"
    })

    
    console.log(`${serviceName} registered with Gateway`);
  } catch (error) {
    console.error('Error registering with Gateway:', error.message);
  }

  const appHttp = await NestFactory.create(AppModule);
  const corsOption = {
    origin: true,
    credentials: true,
    methods: 'GET,POST, *',
    allowedHeaders:'Content-Type, Authorization'
  };


  appHttp.enableCors(corsOption);
  appHttp.useGlobalInterceptors(new TransformationInterceptor())

  appHttp.useGlobalPipes( new ValidationPipe({
    transform: true, // Cela transforme les objets bruts en instances de DTO
    whitelist: true, // Cela supprime les propriétés non définies dans le DTO
    forbidNonWhitelisted: true,

  }));
  await appHttp.listen(3014);

   app.listen();


}

bootstrap();