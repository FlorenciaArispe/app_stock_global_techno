import supabase from "./supabase.service";

async function getModelos() {
  const { data, error } = await supabase.from("Modelo_celular").select();
  if (error) {
    if (error.message === "JWT expired") {
      await supabase.auth.signOut();
      return;
    }
    throw error;
  }
  return data;
}

async function createModelo(nombre: string) {
  const { data, error } = await supabase
    .from("Modelo_celular")
    .insert({ nombre })
    .select("id")
    .single();
  if (error) {
    if (error.message === "JWT expired") {
      await supabase.auth.signOut();
      return;
    }
    throw error;
  }
  return data.id;
}

export { getModelos, createModelo }
