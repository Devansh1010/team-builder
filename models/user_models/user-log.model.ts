import { Schema, model, models } from 'mongoose'

interface ILogEntry {
  groupId: Schema.Types.ObjectId
  groupName: string
  isCreated?: boolean
  isRemoved?: boolean
  isLeaved?: boolean
  msg: string
}

interface IUser_Log {
  _id?: Schema.Types.ObjectId
  userId: Schema.Types.ObjectId
  logs: ILogEntry[]
}

const logEntrySchema = new Schema<ILogEntry>({
  groupId: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  groupName: {
    type: String,
    required: true,
  },
  isCreated: {
    type: Boolean,
    default: false,
  },
  isRemoved: {
    type: Boolean,
    default: false,
  },
  isLeaved: {
    type: Boolean,
    default: false,
  },
  msg: {
    type: String,
    required: true,
  },
})

const userLogSchema = new Schema<IUser_Log>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    logs: [logEntrySchema],
  },
  { timestamps: true }
)

const UserLog = models.UserLog || model<IUser_Log>('UserLog', userLogSchema)

export default UserLog
