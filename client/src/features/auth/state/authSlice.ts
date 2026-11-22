import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '../api/authApi'
import { bootstrapAuth, loginUser, logoutUser, registerUser } from './authAction'
import { disconnectSocket } from '../../../config/socket'

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated'

export interface AuthState {
  user: User | null
  accessToken: string | null
  status: AuthStatus
  error: string | null
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  status: 'idle',
  error: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload
      state.status = 'authenticated'
    },
    clearAuth: (state) => {
      state.user = null
      state.accessToken = null
      state.status = 'unauthenticated'
      state.error = null
      disconnectSocket()
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapAuth.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.status = 'authenticated'
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        state.error = null
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.status = 'unauthenticated'
        state.user = null
        state.accessToken = null
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'authenticated'
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'unauthenticated'
        state.error = (action.payload as string) || 'Login failed'
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'authenticated'
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'unauthenticated'
        state.error = (action.payload as string) || 'Registration failed'
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.accessToken = null
        state.status = 'unauthenticated'
        state.error = null
      })
  },
})

export const { setAccessToken, clearAuth, clearError } = authSlice.actions
export default authSlice.reducer
