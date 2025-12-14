import { create } from "zustand"
import { IUser } from '@/models/user_models/user.model'
import axios from "axios";


interface UserState {
    user: IUser | null;
    allUsers: IUser[] | [];
    isGettingUsers: boolean,
    isGettingActiveUser: boolean,
    message: string,

    setAllUsers: () => void;
    setActiveUser: () => void;
    clearActiveUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    allUsers: [],
    isGettingUsers: false,
    isGettingActiveUser: false,
    message: '',

    setAllUsers: async () => {
        try {
            set({ isGettingUsers: true, message: '' });

            const res = await axios.get('/api/member/group/getAllGroups');

            if (res.data.success) {
                set({
                    allUsers: Array.isArray(res.data.data) ? res.data.data : [],
                    message: res.data.message,
                });
            } else {
                set({ allUsers: [], message: res.data.message });
            }
        } catch {
            set({ allUsers: [], message: 'Error while fetching Users' });
        } finally {
            set({ isGettingUsers: false });
        }
    },

    setActiveUser: async () => {
        try {
            set({ isGettingActiveUser: true, message: '' });


            const res = await axios.get('/api/member/user/me');

            if (!res.data.success) {
                set({
                    user: null,
                    message: res.data.message,
                });
                return;
            }

            set({
                user: res.data.data,
                message: res.data.message,
            });

        } catch {
            set({
                user: null,
                message: 'Error while fetching active User',
            });
        } finally {
            set({ isGettingActiveUser: false });
        }
    },

    clearActiveUser: () => set({ allUsers: [] }),
}));