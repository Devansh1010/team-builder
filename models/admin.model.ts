import mongoose from 'mongoose'

const { Schema, model, models } = mongoose

export interface IAdmin {
  _id?: mongoose.Types.ObjectId
  username: string
  fname: string
  lname: string
  email: string
  password: string
  isVerified: boolean
  verifyCode: string
  verifyCodeExpires: Date
}

const adminSchema = new Schema<IAdmin>(
  {
    username: {
      type: String,
      required: true,
    },

    fname: {
      type: String,
      required: true,
    },

    lname: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verifyCode: {
      type: String,
    },

    verifyCodeExpires: {
      type: Date,
    },
  },
  { timestamps: true }
)

const Admin = models?.Admin || model<IAdmin>('Admin', adminSchema)

export default Admin
