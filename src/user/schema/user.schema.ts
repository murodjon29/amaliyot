import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema({toJSON: {virtuals: true}, timestamps: true, toObject: {virtuals: true}})
export class User extends Document {
    @Prop()
    name: string;

    @Prop()
    password: string;

    @Prop({unique: true})
    email: string;

    @Prop()
    age: number;

    @Prop({default: false})
    isActive: boolean;


    @Prop({default: 'Active'})
    isStatus: 'Block' | 'Active';

}

export const UserSchema = SchemaFactory.createForClass(User);
