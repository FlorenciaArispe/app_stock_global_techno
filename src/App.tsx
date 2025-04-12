import { useEffect, useState } from 'react';
import Dashboard from './Dashboard';
import supabase from './supabase/supabase.service';
import Login from './components/Login';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  const [session, setSession] = useState(null);
  const [productos, setProductos] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [ventas, setVentas] = useState([]);

  async function fetchProductos() {
    const { data, error } = await supabase.from('productos').select('*').order('id', { ascending: true });;

    if (error) {
      if (error.message === "JWT expired") {
        await supabase.auth.signOut();
        return;
      }
    }

    setProductos(data || []);
  }

  async function fetchModelos() {
    const { data, error } = await supabase.from('Modelo_celular').select('*');

    if (error) {
      if (error.message === "JWT expired") {
        await supabase.auth.signOut();
        return;
      }
    }
    setModelos(data || []);
  }

  async function fetchVentas() {
    const { data, error } = await supabase.from('Ventas').select('*').order('id', { ascending: true });;

    if (error) {
      if (error.message === "JWT expired") {
        await supabase.auth.signOut();
        return;
      }
    }

    setVentas(data || []);
  }

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const productosChannel = supabase
      .channel('productos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'productos' }, (payload) => {
        fetchProductos();
      })
      .subscribe();

    const modelosChannel = supabase
      .channel('modelos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Modelo_celular' }, (payload) => {
        fetchModelos();
      })
      .subscribe();

    const ventasChannel = supabase
      .channel('ventas')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Ventas' }, (payload) => {
        fetchVentas();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(productosChannel);
      supabase.removeChannel(modelosChannel);
      supabase.removeChannel(ventasChannel);
    };
  }, []);

  return (
    <ChakraProvider>

      {session ? (
        <Dashboard
          productos={productos}
          fetchProductos={fetchProductos}
          ventas={ventas}
          fetchVentas={fetchVentas}
          modelos={modelos}
          fetchModelos={fetchModelos}
        />
      ) : (
        <Login onLogin={setSession} />
      )}

    </ChakraProvider>
  );
}

export default App;
