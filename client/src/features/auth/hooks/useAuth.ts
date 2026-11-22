import { useAppDispatch, useAppSelector } from '../../../shared/hooks'
import type { LoginPayload, RegisterPayload } from '../api/authApi'
import { loginUser, logoutUser, registerUser } from '../state/authAction'

export function useAuth() {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)

  return {
    ...auth,
    login: async (payload: LoginPayload) =>
      loginUser.fulfilled.match(await dispatch(loginUser(payload))),
    register: async (payload: RegisterPayload) =>
      registerUser.fulfilled.match(await dispatch(registerUser(payload))),
    logout: () => dispatch(logoutUser()),
  }
}
