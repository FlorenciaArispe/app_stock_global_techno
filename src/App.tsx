import { useEffect, useState } from 'react';
import Dashboard from './Dashboard';
import supabase from './supabase/supabase.service';
import Login from './components/Login';
import { Box, ChakraProvider } from '@chakra-ui/react';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event);
      setSession(session);
    });
  
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
  

  return (
    <ChakraProvider>

        {session ? (
          <Dashboard onLogout={() => supabase.auth.signOut()} />
        ) : (
          <Login onLogin={setSession} />
        )}

    </ChakraProvider>
  );
}

export default App;
