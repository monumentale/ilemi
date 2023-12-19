import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { AgentModule } from './agent/agent.module';
import { PropertyModule } from './property/property.module';
import * as dotenv from 'dotenv';


@Module({
  imports: [
    ThrottlerModule.forRoot({ ttl: 60, limit: 40 }),
    // MongooseModule.forRoot(process.env.MONGODB_URL),
    MongooseModule.forRoot('mongodb+srv://ilemi:fD8aIIMVpu5E17NZ@cluster0.1btqs5u.mongodb.net/?retryWrites=true&w=majority'),
    AuthModule,
    AgentModule,
    PropertyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
