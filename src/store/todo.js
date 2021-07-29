import {defineStore} from 'pinia'
export const useStore = defineStore({
  id: 'main',
  state: () => ({
    unCompleteNum:0,
    completeNum: 0,
    allNum:0
  }),
})