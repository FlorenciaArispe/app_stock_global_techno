export interface Categoria {
    id: number;
    nombre: string;
  }
  
  export const categorias: Categoria[] = [
    { id: 1, nombre: "Celular Nuevo" },
    { id: 2, nombre: "Celular Usado" },
    { id: 3, nombre: "Accesorio" },
  ];

  export interface Capacidad {
    id: number;
    nombre: string;
  }

  export const capacidades: Capacidad [] = [
    { id: 1, nombre: "128GB" },
    { id: 2, nombre: "256GB" },
    { id: 3, nombre: "512GB" },
    { id: 4, nombre: "1TB" },
  ];