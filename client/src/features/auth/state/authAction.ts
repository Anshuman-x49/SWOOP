import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { disconnectSocket } from '../../../config/socket'
import { authApi, type LoginPayload, type RegisterPayload } from '../api/authApi'

export const bootstrapAuth = createAsyncThunk(
  'auth/bootstrap',
  async (_, { rejectWithValue }) => {
    try {
      const result = await authApi.refreshToken()
      return result.data
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        return rejectWithValue(err.response.data.message)
      }
      return rejectWithValue('Session expired or not logged in')
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const result = await authApi.login(payload)
      return result.data
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        return rejectWithValue(err.response.data.message)
      }
      return rejectWithValue('Failed to login')
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const result = await authApi.register(payload)
      return result.data
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        return rejectWithValue(err.response.data.message)
      }
      return rejectWithValue('Failed to register')
    }
  }
)

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try {
    await authApi.logout()
  } catch {
    // Ignore backend logout errors to always cleanly clear client auth
  } finally {
    disconnectSocket()
  }
})
