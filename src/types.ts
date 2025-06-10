export interface Producto {
    id: number;
    nombre: string;
    capacidad: string;
    categoria: number;
    color: string;
    minorista: number;
    mayorista: number;
    modeloId: number;
    stock: number;
  }
  
  export interface Modelo {
    id: number;
    nombre: string;
  }
  
  export interface ProductoVenta {
    imei: string;
    nombre: string;
    cantidad: number;
    subtotal: number;
    descripcion: string;
  }
  
  export interface Venta {
    id: number;
    fecha_venta: string;
    productos: ProductoVenta[]; 
    total: number;
    cliente: string;
  }
  