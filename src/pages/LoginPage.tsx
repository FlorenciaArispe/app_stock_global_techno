import { useNavigate } from 'react-router-dom'
import Login from '../components/Login'

export default function LoginPage() {
  const navigate = useNavigate()

  const handleLogin = (session: any) => {
    if (session) {
      navigate('/inicio')
    }
  }

  return <Login onLogin={handleLogin} />
}
