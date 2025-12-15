import { Schema, model, models } from 'mongoose'

export interface IBatch {
  id?: Schema.Types.ObjectId
  batch_name: string
  limit: number
  users: string[]
}

const batchSchema = new Schema<IBatch>(
  {
    batch_name: {
      type: String,
      required: true,
    },

    limit: {
      type: Number,
      required: true,
      default: 4,
    },

    users: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
)

const Batch = models.Batch || model<IBatch>('Batch', batchSchema)

export default Batch
