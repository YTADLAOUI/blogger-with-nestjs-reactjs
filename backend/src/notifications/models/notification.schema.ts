import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>; ;
@Schema({ timestamps: true })
export class Notification  {
  @Prop({ type: String, enum: ["like", "comment"], required: true })
  type: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'Article' })
  article: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
  notification_for: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
  user: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Comment' })
  comment: MongooseSchema.Types.ObjectId;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
