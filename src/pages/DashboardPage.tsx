import { useEffect, useState } from "react";
import Dashboard from "../Dashboard";
import { fetchModelos, fetchProductos, fetchVentas } from "../services/fetchData";
import { Modelo, Producto, Venta } from "../types";
import supabase from "../supabase/supabase.service";

export default function DashboardPage() {
  const [session, setSession] = useState<any>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);

  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    initSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      const productosData = await fetchProductos();
      const modelosData = await fetchModelos();
      const ventasData = await fetchVentas();

      setProductos(productosData);
      setModelos(modelosData);
      setVentas(ventasData);
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const productosChannel = supabase
      .channel('productos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'productos' }, async () => {
        const productosData = await fetchProductos()
        setProductos(productosData)
      })
      .subscribe()

    const modelosChannel = supabase
      .channel('modelos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Modelo_celular' }, async () => {
        const modelosData = await fetchModelos()
        setModelos(modelosData)
      })
      .subscribe()

    const ventasChannel = supabase
      .channel('ventas')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Ventas' }, async () => {
        const ventasData = await fetchVentas()
        setVentas(ventasData)
      })
      .subscribe()

    return () => {
      productosChannel.unsubscribe()
      modelosChannel.unsubscribe()
      ventasChannel.unsubscribe()
    }
  }, [])

  return (
    <Dashboard
      productos={productos}
      modelos={modelos}
      ventas={ventas}
      setSession={setSession}
    />
  );
}
