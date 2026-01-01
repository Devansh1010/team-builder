import { Schema, model, models } from 'mongoose'

export interface IUserData {
  id?: Schema.Types.ObjectId
  email: string
  username: string
  batchId: Schema.Types.ObjectId
}

const userDataSchema = new Schema<IUserData>({
  username: {
    type: String,
  },

  email: {
    type: String,
    required: true,
  },

  batchId: {
    type: Schema.Types.ObjectId,
    ref: 'Batch'
  }
})

const UserData = models.UserData || model<IUserData>('UserData', userDataSchema)

export default UserData
