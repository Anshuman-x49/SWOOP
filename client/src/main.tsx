import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store/Store'
import { bootstrapAuth } from './features/auth/state/authAction'
import App from './App'
import './index.css'

// Trigger auth bootstrap to check existing session cookie before routes render
store.dispatch(bootstrapAuth())

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
)
