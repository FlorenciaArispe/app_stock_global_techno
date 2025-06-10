import supabase from "./supabase.service";

async function getProductos() {
  const { data, error } = await supabase
    .from("productos")
    .select()
  if (error) {
    if (error.message === "JWT expired") {
      await supabase.auth.signOut();
      return;
    }
    throw error;
  }
  return data;
}

async function deleteProducto(id: number) {
  const { error } = await supabase.from("productos").delete().eq("id", id);
  if (error) {
    if (error.message === "JWT expired") {
      await supabase.auth.signOut();
      return;
    }
    throw error;
  }
}

async function createProducto(
  stock: number,
  categoria: number,
  mayorista: number,
  minorista: number,
  capacidad: string,
  color: string,
  modelo: string,
  nombre: string
): Promise<number | undefined> {
  const { data, error } = await supabase
    .from("productos")
    .insert({
      stock,
      categoria,
      mayorista,
      minorista,
      capacidad,
      color,
      modelo,
      nombre
    })
    .select("id") 
    .single(); 

  if (error) {
    if (error.message === "JWT expired") {
      await supabase.auth.signOut();
      return;
    }
    throw error;
  }

  return data?.id;
}


async function updateProducto(id: number, data: any) {
  const { error } = await supabase
    .from("productos")
    .update(data)
    .eq("id", id);
  if (error) {
    if (error.message === "JWT expired") {
      await supabase.auth.signOut();
      return;
    }
    throw error;
  }
}

async function updateStockProducto(id: number, nuevoStock: number) {
  const { error } = await supabase
    .from('productos')
    .update({ stock: nuevoStock })
    .eq('id', id);
  if (error) {
    if (error.message === 'JWT expired') {
      await supabase.auth.signOut();
      return;
    }
    throw error;
  }
}

async function uploadFotosProducto(productoId: number, archivos: File[]) {
  const bucket = "imagenes-productos";
  const rutasSubidas: string[] = [];

  for (let i = 0; i < archivos.length; i++) {
 
    const archivo = archivos[i];

    const extension = archivo.name.split(".").pop() || "jpg";

    const nombreArchivo = `productos/${productoId}/foto${i + 1}-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(nombreArchivo, archivo, { upsert: true });

    if (uploadError) {
      console.error("Error al subir archivo:", uploadError.message);
      throw uploadError;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(nombreArchivo);
    rutasSubidas.push(data.publicUrl);
  }

  const { error: updateError } = await supabase
    .from("productos")
    .update({ fotos: rutasSubidas })
    .eq("id", productoId);

  if (updateError) {
    throw updateError;
  }

  return rutasSubidas;
}


export { getProductos, deleteProducto, createProducto, updateProducto, updateStockProducto , uploadFotosProducto};
