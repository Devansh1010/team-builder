import { Schema, model, models } from 'mongoose';

export interface IBatch {
  id?: Schema.Types.ObjectId
  batch_name: string,
  limit: number,
  users: string[]
}

const setSchema = new Schema<IBatch>({
  
  batch_name: {
    type: String,
    required: true
  },

  limit: {
    type: Number,
    required: true,
    default: 4
  },

  users: [
    {
      type: String
    }
  ]
}, { timestamps: true });

const Set = models.Set || model<IBatch>('Set', setSchema)

export default Set

