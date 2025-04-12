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

export async function getVentas(): Promise<Venta[] | null> {
  const { data, error } = await supabase
    .from("Ventas")
    .select("*")
    .order("id", { ascending: true });
  if (error) {
    return null;
  }
  return data;
}

export async function createVenta(venta: Venta): Promise<void> {
  const { error } = await supabase.from("Ventas").insert([venta]);
  if (error) {
    throw error;
  }
}

export async function updateVenta(id: number, venta: Partial<Venta>): Promise<void> {
  const { error } = await supabase.from("Ventas").update(venta).eq("id", id);
  if (error) {
    throw error;
  }
}

export async function deleteVenta(id: number): Promise<void> {
  const { error } = await supabase.from("Ventas").delete().eq("id", id);
  if (error) {
    throw error;
  }
}