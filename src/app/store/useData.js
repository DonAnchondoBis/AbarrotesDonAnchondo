import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useData = create(
  persist(
    set => ({
      role: null,
      userId: null,
      setRole: role => set({ role }),
      setUserId: userId => set({ userId }),
    }),
    {
      name: '__ANCHONDO__DATA',
      whitelist: ['userId', 'role'],
    }
  )
)