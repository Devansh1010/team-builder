
import { create } from "zustand"
import { IGroup } from '@/models/user_models/group.model'
import axios from "axios";


interface GroupState {
    groups: IGroup[];
    activeGroup: IGroup[];
    selectedGroup: IGroup[],
    isGettingGroups: boolean,
    isGettingActiveGroup: boolean,
    message: string,

    setGroups: () => void;
    setActiveGroup: (groupId?: string) => void;
    clearActiveGroup: () => void;
}

export const useGroupStore = create<GroupState>((set) => ({
    groups: [],
    activeGroup: [],
    selectedGroup: [],
    isGettingGroups: false,
    isGettingActiveGroup: false,
    message: '',

    setGroups: async () => {
        try {
            set({ isGettingGroups: true, message: '' });

            const res = await axios.get('/api/member/group/getAllGroups');

            if (res.data.success) {
                set({
                    groups: Array.isArray(res.data.data) ? res.data.data : [],
                    message: res.data.message,
                });
            } else {
                set({ groups: [], message: res.data.message });
            }
        } catch {
            set({ groups: [], message: 'Error while fetching groups' });
        } finally {
            set({ isGettingGroups: false });
        }
    },

    setActiveGroup: async (groupId?: string) => {
        try {
            set({ isGettingActiveGroup: true, message: '' });

            const isUserContext = !groupId;

            const res = await axios.get('/api/member/group/getGroupById', {
                params: groupId ? { groupId } : undefined,
            });

            if (!res.data.success) {
                set({
                    activeGroup: [],
                    message: res.data.message,
                });
                return;
            }

            if (!isUserContext) {
                set({selectedGroup: res.data.data})
            }

            const fetchedGroups = Array.isArray(res.data.data)
                ? res.data.data
                : [res.data.data];

            set({
                activeGroup: fetchedGroups,
                message: res.data.message,
            });

        } catch {
            set({
                activeGroup: [],
                message: 'Error while fetching active groups',
            });
        } finally {
            set({ isGettingActiveGroup: false });
        }
    },


    clearActiveGroup: () => set({ activeGroup: [] }),
}));
