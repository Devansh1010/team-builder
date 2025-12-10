import { Schema, model, models } from 'mongoose';


export enum UserRole {
    LEADER = "leader",
    MEMBER = "member",
}

interface IGroup {
    _id?: Schema.Types.ObjectId,
    groupId: Schema.Types.ObjectId,
    userRole: UserRole,
    joinedAt: Date,
    leftAt: Date | null
}

interface IInvitation {
    _id?: Schema.Types.ObjectId,
    gropuId: Schema.Types.ObjectId,
    invitedBy: Schema.Types.ObjectId,
}

interface IRequestedGroups {
    gropuId: Schema.Types.ObjectId,
}

export interface IUser {
    _id?: Schema.Types.ObjectId,
    username: string,
    email: string,
    password: string,
    avatar: string,
    isVerified: boolean,
    verifyCode: string,
    verifyExpiry: Date,
    groups: IGroup[],
    invitation: IInvitation[]
    requestedGroups: IRequestedGroups[]
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        min: [2, 'Minimum 2 Character required in Username'],
        required: [true, 'Username Required'],
        unique: true
    },

    email: {
        type: String,
        required: [true, "Email Required"],
        unique: true,
    },

    password: {
        type: String,
        required: [true, "Password Required"],
    },

    avatar: {
        type: String,
        default: "",
    },

    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },

    verifyCode: {
        type: String
    },

    verifyExpiry: {
        type: Date
    },

    groups: [
        {
            groupId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
            userRole: { type: String, enum: Object.values(UserRole), required: true },
            joinedAt: { type: Date, default: Date.now },
        },
    ],

    invitation: [
        {
            gropuId: { type: Schema.Types.ObjectId, ref: "Group", required: true },
            invitedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        },
    ],

    requestedGroups: [
        {
            groupId: {
                type: Schema.Types.ObjectId,
                ref: "Group", required: true
            },
            isAccept: {
                type: Boolean,
                default: false
            }
        },
    ]
}, { timestamps: true })

const User = models.User || model<IUser>('User', userSchema)

export default User