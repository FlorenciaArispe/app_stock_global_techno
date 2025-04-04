import { useEffect, useState } from 'react'

import Dashboard from './Dashboard' 
import supabase from './supabase/supabase.service'
import Login from './components/Login'
import { Box, ChakraProvider } from '@chakra-ui/react'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    const currentSession = supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return (
       <ChakraProvider>
         <Box bg="#0E2640" minH="100vh" display="flex" alignItems="center" justifyContent="center">
      {session ? 
      <Dashboard onLogout={() => supabase.auth.signOut()} />
       : <Login onLogin={setSession} />}
     </Box>
        </ChakraProvider>
  )
}

export default App;