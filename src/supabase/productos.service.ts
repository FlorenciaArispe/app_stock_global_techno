import supabase from "./supabase.service";

async function getProductos() {
    const {data, error}= await supabase.from("productos").select();
    if(error) throw error
    return data
}

export { getProductos }