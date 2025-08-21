import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }, // <-- SHU YERDA REGISTRATSIYA QILINYAPTI
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // agar boshqa modullarda ishlatilsa
})
export class UserModule {}
