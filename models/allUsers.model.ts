import { Schema, model, models } from 'mongoose';

export interface IUserData {
  id?: Schema.Types.ObjectId
  email: string,
  username: string
}

const userDataSchema = new Schema<IUserData>({
    username: {
        type: String,
    },

    email: {
        type: String,
        required: true
    }
})

const UserData = models.UserData || model<IUserData>('UserData', userDataSchema)

export default UserData