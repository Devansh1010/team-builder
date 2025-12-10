import { Schema, model, models } from 'mongoose';

interface IUser_Log {
    _id?: Schema.Types.ObjectId
    groupId: Schema.Types.ObjectId
    groupName: string,
    isCreated: boolean,
    isRemoved: boolean,
    isLeaved: boolean,
    msg: string,
}

const userLogSchema = new Schema<IUser_Log>({
    groupId: {
        type: Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    groupName: {
        type: String,
        required: true
    },
    isCreated:{
        type: Boolean,
        default: true
    },
    isRemoved:{
        type: Boolean,
        default: true
    },
    isLeaved:{
        type: Boolean,
        default: true
    },  
    msg: {
        type: String,
        required: true
    }
}, {timestamps: true})

const UserLog = models.UserLog<IUser_Log> || model<IUser_Log>('UserLog', userLogSchema)

export default UserLog