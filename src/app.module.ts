import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://Murpodjon:murodjon@cluster0.afvnxby.mongodb.net/amaliyot'), UserModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
