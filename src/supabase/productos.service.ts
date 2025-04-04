import supabase from "./supabase.service";

async function getProductos() {
    const {data, error}= await supabase.from("productos").select();
    if(error) throw error
    return data
}

async function deleteProducto(id : number){
const {error} = await supabase.from("productos").delete().eq("id", id);
if (error) throw error;
}

async function createProducto(stock : number , categoria : number , valorNeto : number , mayorista: number , minorista: number, capacidad : string , color : string, modeloId: number , nombre : string , imei : number ){
const {error} = await supabase.from("productos").insert({stock, categoria, valorNeto , mayorista, minorista, capacidad,color, modeloId, nombre, imei})
if ( error ) throw error;
}


export { getProductos , deleteProducto , createProducto }