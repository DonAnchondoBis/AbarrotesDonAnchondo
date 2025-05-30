import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useData = create(
  persist(
    set => ({
      role: null,
      userId: null,
      setParticipant: role => set({ role }),
      setProfessorId: userId => set({ userId }),
    }),
    {
      name: '__ANCHONDO__DATA',
      whitelist: ['userId', 'role'],
    }
  )
)