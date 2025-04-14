import { useEffect, useState } from "react";
import Dashboard from "../Dashboard";
import { fetchModelos, fetchProductos, fetchVentas } from "../services/fetchData";
import { Modelo, Producto, Venta } from "../types";
import supabase from "../supabase/supabase.service";

interface DashboardPageProps {
  onLogout: () => Promise<void>;
}

export default function DashboardPage({ onLogout }: DashboardPageProps) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);

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
      onLogout={onLogout}
    />
  );
}
