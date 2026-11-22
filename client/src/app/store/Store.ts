import { configureStore } from '@reduxjs/toolkit'
import authReducer, { setAccessToken, clearAuth } from '../../features/auth/state/authSlice'
import { injectStore } from '../../config/Axios'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

// Wire up the store into Axios without circular dependencies
injectStore(store, {
  setAccessToken: (token: string) => store.dispatch(setAccessToken(token)),
  logout: () => store.dispatch(clearAuth()),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
