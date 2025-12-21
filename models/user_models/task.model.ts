import mongoose, { Schema, Document, Types } from 'mongoose'
import { TaskStatus, TaskPriority } from '@/lib/constraints/task'

export interface IAccessTo {
  userId: Types.ObjectId
  username: string
}

export interface ITask extends Document {
  title: string
  description?: string

  groupId: Types.ObjectId

  status: TaskStatus
  priority: TaskPriority

  assignedTo?: IAccessTo[]

  createdBy: {
    userId: Types.ObjectId
    username: string
  }

  dueDate?: Date

  createdAt: Date
  updatedAt: Date
}

const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    description: {
      type: String,
      trim: true,
    },

    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
    },

    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM,
    },

    assignedTo: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        username: {
          type: String,
        },
      },
    ],

    createdBy: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
    },

    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

const Task = mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema)

export default Task
