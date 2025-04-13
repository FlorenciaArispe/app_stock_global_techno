import supabase from "./supabase.service";

export type Venta = {
  id?: number;
  fecha_venta: string;
  cliente: string;
  productos: ProductoVenta[];
  total: number;
};

export type ProductoVenta = {
  nombre: string;
  cantidad: number;
  subtotal: number;
  imei: string;
  descripcion: string;
  tipoVenta: string;
};

export async function getVentas() {
  const { data, error } = await supabase.from("Ventas").select();
  if (error) {
    if (error.message === "JWT expired") {
      await supabase.auth.signOut();
      return;
    }
    throw error;
  }
  return data;
}

export async function createVenta(ventaData: any) {
  const { error } = await supabase.from("Ventas").insert(ventaData);
  if (error) {
    if (error.message === "JWT expired") {
      await supabase.auth.signOut();
      return;
    }
    throw error;
  }
}

export async function deleteVenta(id: number) {
  const { error } = await supabase.from("Ventas").delete().eq("id", id);
  if (error) {
    if (error.message === "JWT expired") {
      await supabase.auth.signOut();
      return;
    }
    throw error;
  }
}

export async function updateVenta(id: number, data: any) {
  const { error } = await supabase.from("Ventas").update(data).eq("id", id);
  if (error) {
    if (error.message === "JWT expired") {
      await supabase.auth.signOut();
      return;
    }
    throw error;
  }
}
