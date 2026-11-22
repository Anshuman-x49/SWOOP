import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../app/store/Store'

export const useAppDispatch = () => useDispatch<AppDispatch>()
