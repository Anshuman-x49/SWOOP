import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { usersApi, type Participant } from '../api/usersApi'

export interface UsersState {
  searchResults: Participant[]
  searchStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: UsersState = {
  searchResults: [],
  searchStatus: 'idle',
  error: null,
}

export const searchUsersQuery = createAsyncThunk(
  'users/search',
  async (query: string, { rejectWithValue }) => {
    try {
      if (!query.trim()) return []
      const users = await usersApi.searchUsers(query)
      return users
    } catch (err: unknown) {
      return rejectWithValue('Failed to search users')
    }
  }
)

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = []
      state.searchStatus = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUsersQuery.pending, (state) => {
        state.searchStatus = 'loading'
        state.error = null
      })
      .addCase(searchUsersQuery.fulfilled, (state, action: PayloadAction<Participant[]>) => {
        state.searchStatus = 'succeeded'
        state.searchResults = action.payload
      })
      .addCase(searchUsersQuery.rejected, (state, action) => {
        state.searchStatus = 'failed'
        state.error = (action.payload as string) || 'Search failed'
      })
  },
})

export const { clearSearchResults } = usersSlice.actions
export default usersSlice.reducer
