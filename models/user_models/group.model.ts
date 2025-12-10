import { Schema, model, models } from 'mongoose';
import { UserRole } from './user.model';

interface IMembers {
    _id?: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    userRole: UserRole,
    joinedAt: Date,
    leftAt: Date | null    
}

interface IAccessTo {
    _id?: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    userRole: UserRole,
    joinedAt: Date,  
}

interface IInvitedUser {
    userInvited: Schema.Types.ObjectId
}

export interface IGroup {
    _id?: Schema.Types.ObjectId,
    name: string,
    desc: string,
    techStack: string[],
    imageUrl: string,
    members: IMembers[]
    accessTo: IAccessTo
    invitedUsers: IInvitedUser[]
}

const groupSchema = new Schema<IGroup>({
    name: {
        type: String,
        min: [2, 'Minimum 2 Character required in Group Name'],
        required: [true, 'Username Required'],
    },

    desc: {
        type: String,
    },

    techStack: {
        type: [String],
        required: [true, "techStack is Required"],
    },

    imageUrl: {
        type: String,
        default: "",
    },

    members: [
        {
            userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
            userRole: { type: String, enum: Object.values(UserRole), required: true },
            joinedAt: { type: Date, default: Date.now },
            leftAt: { type: Date, default: null },
        },
    ],

    accessTo: [
        {
            userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
            userRole: {type: String,  enum: Object.values(UserRole), required: true },
            joinedAt: {type: Date, required: true}
        },
    ],

    invitedUsers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, { timestamps: true })

const Group = models.Group || model<IGroup>('Group', groupSchema)

export default Group