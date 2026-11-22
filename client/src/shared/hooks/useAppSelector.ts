import { useSelector, type TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '../../app/store/Store'

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
