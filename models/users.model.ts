import { Schema, model, models } from 'mongoose';

export interface IUsers {
  id?: Schema.Types.ObjectId
  batch_name: string,
  limit: number,
  users: string[]
}

const setSchema = new Schema<IUsers>({
  
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

const Set = models.Set || model<IUsers>('Set', setSchema)

export default Set

