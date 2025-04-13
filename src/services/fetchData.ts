import supabase from "../supabase/supabase.service";
import { Modelo, Producto, Venta } from "../types";

export const fetchProductos = async (): Promise<Producto[]> => {
  const { data, error } = await supabase.from('productos').select('*').order('id', { ascending: true });

  if (error) {
    if (error.message === 'JWT expired') {
      await supabase.auth.signOut();
      return [];
    }
    console.error('Error fetching productos:', error);
    return [];
  }

  return data || [];
};

export const fetchModelos = async (): Promise<Modelo[]> => {
  const { data, error } = await supabase.from('Modelo_celular').select('*');

  if (error) {
    if (error.message === 'JWT expired') {
      await supabase.auth.signOut();
      return [];
    }
    console.error('Error fetching modelos:', error);
    return [];
  }

  return data || [];
};

export const fetchVentas = async (): Promise<Venta[]> => {
  const { data, error } = await supabase.from('Ventas').select('*').order('id', { ascending: true });

  if (error) {
    if (error.message === 'JWT expired') {
      await supabase.auth.signOut();
      return [];
    }
    console.error('Error fetching ventas:', error);
    return [];
  }

  return data || [];
};
