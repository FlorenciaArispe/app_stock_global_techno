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
  valorNeto: number,
  mayorista: number,
  minorista: number,
  capacidad: string,
  color: string,
  modeloId: number,
  nombre: string
) {
  const { error } = await supabase.from("productos").insert({
    stock,
    categoria,
    valorNeto,
    mayorista,
    minorista,
    capacidad,
    color,
    modeloId,
    nombre
  });

  if (error) {
    if (error.message === "JWT expired") {
      await supabase.auth.signOut();
      return;
    }
    throw error;
  }
}

async function updateProducto(id: number, data: any) {
  console.log("aca data",data)
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

async function updateStockProducto(id, nuevoStock) {
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


export { getProductos, deleteProducto, createProducto, updateProducto , updateStockProducto};
