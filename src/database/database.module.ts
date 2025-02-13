import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      inject: [ConfigService],
      
      useFactory: (configService :
        ConfigService)=> ({
          type: 'mysql',
          host:configService.get('MYSQL_HOST'),
          port: configService.get('MYSQL_PORT'),
          username: configService.get('MYSQL_USER'),
          password: configService.get(''),
          database: configService.get('MYSQL_DATABASE'),
          entities: [__dirname+ '/**/*.entity{.ts,.js}'],
          keepConnectionAlive:true,
          connectTimeout:10000,
          autoLoadEntities: true,
          synchronize:true,
        })
    })
  ],
})
export class DatabaseModule {}
