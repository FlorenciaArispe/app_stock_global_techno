import { useEffect, useState } from "react";
import {
  ChakraProvider,
  Box,
  Flex,
  Text,
  Button,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
} from "@chakra-ui/react";
import { HiMenu } from "react-icons/hi";
import Ventas from "./components/Ventas";
import Productos from "./components/Productos";
import { getProductos } from "./supabase/productos.service";

// const Producto = [
//   { id: 1,nombre: null , modeloId: 1, capacidad: "256GB", stock: 10, color: "Negro", valorNeto: 800, mayorista: 950, minorista: 1100, categoria: 1 },
//   { id: 2,nombre: null , modeloId: 2, capacidad: "512GB", stock: 5, color: "Verde", valorNeto: 700, mayorista: 850, minorista: 1000, categoria: 1 },
//   { id: 3,nombre: null , modeloId: 3, capacidad: "256GB", stock: 10, color: "Negro", valorNeto: 800, mayorista: 950, minorista: 1100, categoria: 1 },
//   { id: 4,nombre: null , modeloId: 4, capacidad: "512GB", stock: 5, color: "Verde", valorNeto: 700, mayorista: 850, minorista: 1000, categoria: 1 },
//   { id: 5,nombre: null , modeloId: 5, capacidad: "256GB", stock: 10, color: "Negro", valorNeto: 800, mayorista: 950, minorista: 1100, categoria: 1 },
//   { id: 6,nombre: null , modeloId: 6, capacidad: "512GB", stock: 5, color: "Verde", valorNeto: 700, mayorista: 850, minorista: 1000, categoria: 1 },
//   { id: 7, nombre: null ,modeloId: 7, capacidad: "256GB", stock: 10, color: "Negro", valorNeto: 800, mayorista: 950, minorista: 1100, categoria: 1 },
//   { id: 8, nombre: null ,modeloId: 8, capacidad: "512GB", stock: 5, color: "Verde", valorNeto: 700, mayorista: 850, minorista: 1000, categoria: 1 },
//   { id: 9, nombre: null ,modeloId: 9, capacidad: "256GB", stock: 10, color: "Negro", valorNeto: 800, mayorista: 950, minorista: 1100, categoria: 1 },
//   { id: 10, nombre: null ,modeloId: 10, capacidad: "512GB", stock: 5, color: "Verde", valorNeto: 700, mayorista: 850, minorista: 1000, categoria: 1 },
//   { id: 11, nombre: null ,modeloId: 1, capacidad: "256GB", stock: 10, color: "Pink", valorNeto: 800, mayorista: 950, minorista: 1100, categoria: 1 },
//   { id: 12,nombre: null ,modeloId: 2, capacidad: "512GB", stock: 5, color: "White", valorNeto: 700, mayorista: 850, minorista: 1000, categoria: 1 },
//   { id: 13, nombre: null ,modeloId: 1, capacidad: "256GB", stock: 10, color: "White", valorNeto: 800, mayorista: 950, minorista: 1100, categoria: 1 },
//   { id: 14, nombre: null, modeloId: 2, capacidad: "512GB", stock: 5, color: "Blue", valorNeto: 700, mayorista: 850, minorista: 1000, categoria: 1 },
//   { id: 15,nombre: null , modeloId: 11, capacidad: "128GB", stock: 4, color: "Azul", valorNeto: 500, mayorista: 650, minorista: 800, categoria: 2 },
//   { id: 16, nombre: null ,modeloId: 3, capacidad: "256GB", stock: 6, color: "Negro", valorNeto: 900, mayorista: 1050, minorista: 1200, categoria: 2 },
//   { id: 17, nombre: "Cargador Rápido", modeloId: null, capacidad: null, stock: 4, color: null, valorNeto: 500, mayorista: 650, minorista: 800, categoria: 2 },
//   { id: 18, nombre: "Funda iPhone 14", modeloId: null, capacidad: null, stock: 6, color: null, valorNeto: 900, mayorista: 1050, minorista: 1200, categoria: 2 },
// ];



const modelos_celulares = [
  { id: 1, nombre: "14 Pro" },
  { id: 2, nombre: "13" },
  { id: 3, nombre: "15 Pro" },
  { id: 4, nombre: "16" },
  { id: 5, nombre: "13 Pro" },
  { id: 6, nombre: "14" },
  { id: 7, nombre: "15" },
  { id: 8, nombre: "16 pro" },
  { id: 9, nombre: "16 Pro max" },
  { id: 10, nombre: "15 pro max" },
  { id: 11, nombre: "12" }
];

const categorias= [
  {id:1 , nombre: "Celular Nuevo"},
  {id:2 , nombre: "Celular Usado"},
  {id:3, nombre: "Accesorio"}
]


function App() {
  const [activeScreen, setActiveScreen] = useState("ventas");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [productos, setProductos]= useState([]);

  async function fetchProductos(){
    const allProducts=await getProductos();
    setProductos(allProducts)
    console.log(allProducts)
  }

  useEffect(() =>{
    fetchProductos()
  } , [])


  return (
    <ChakraProvider>
      <Box bg="#154273" minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Box bg="#f4f6f9" w="calc(100% - 30px)" h="calc(100vh - 40px)" borderRadius="lg" boxShadow="lg">
          <Flex bg="#0E2640" p={4} borderTopRadius="lg" align="center" justify="space-between">
            <Text ml={10} fontSize={{ base: "18px", md: "22px" }} fontWeight="bold" color="white">
              Stock Global Technology
            </Text>
            <Flex display={{ base: "none", md: "flex" }} gap={4}>
              <Button variant="ghost" color="white" fontWeight="bold"
                _hover={{ bg: "gray.700" }} _active={{ bg: "gray.300", color: "black" }}
                onClick={() => setActiveScreen("ventas")} isActive={activeScreen === "ventas"}>
                Ventas
              </Button>
              <Button variant="ghost" color="white" fontWeight="bold"
                _hover={{ bg: "gray.700" }} _active={{ bg: "gray.300", color: "black" }}
                onClick={() => setActiveScreen("productos")} isActive={activeScreen === "productos"}>
                Productos
              </Button>
            </Flex>
            <IconButton aria-label="Open menu" icon={<HiMenu />}
              display={{ base: "flex", md: "none" }} onClick={onOpen}
              color="white" bg="transparent" _hover={{ bg: "gray.700" }}
            />
          </Flex>

          <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
            <DrawerOverlay>
              <DrawerContent bg="#0E2640">
                <DrawerBody>
                  <Button w="100%" mb={4} variant="ghost" color="white" fontWeight="bold"
                    onClick={() => { setActiveScreen("ventas"); onClose(); }}>
                    Ventas
                  </Button>
                  <Button w="100%" variant="ghost" color="white" fontWeight="bold"
                    onClick={() => { setActiveScreen("productos"); onClose(); }}>
                    Productos
                  </Button>
                </DrawerBody>
              </DrawerContent>
            </DrawerOverlay>
          </Drawer>

          <Box p={5}>
            {activeScreen === "ventas" && <Ventas productos={productos} modelos={modelos_celulares} />}
            {activeScreen === "productos" && <Productos productos={productos} categorias={categorias} modelos={modelos_celulares} />}
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
