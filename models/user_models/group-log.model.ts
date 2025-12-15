import { Schema, model, models } from 'mongoose'

interface ILogs {
  userId: Schema.Types.ObjectId
  username: string
  isRemoved?: boolean
  isLeaved?: boolean
  msg: string
}

interface IGroup_Log {
  _id?: Schema.Types.ObjectId
  groupId: Schema.Types.ObjectId
  logs: ILogs[]
}

const logSubSchema = new Schema<ILogs>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
    required: true,
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

const groupLogSchema = new Schema<IGroup_Log>(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    logs: [logSubSchema],
  },
  { timestamps: true }
)

const GroupLog = models.GroupLog || model<IGroup_Log>('GroupLog', groupLogSchema)

export default GroupLog
