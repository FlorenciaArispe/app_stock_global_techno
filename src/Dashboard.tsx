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
import { deleteProducto, getProductos } from "./supabase/productos.service";
import supabase from "./supabase/supabase.service";

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


function Dashboard (onLogout : any) {
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

  const handleDeleteProduct = async (id : number)=>{
    await deleteProducto(id)
    await fetchProductos()
  }


  return (
    //<ChakraProvider>
     // <Box bg="#154273" minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Box bg="#f4f6f9" w="calc(100% - 30px)" h="calc(100vh - 40px)" borderRadius="lg" boxShadow="lg">
          <Flex bg="#154273" p={4} borderTopRadius="lg" align="center" justify="space-between">
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
              <Button
              onClick={() => supabase.auth.signOut()}
              variant="ghost" color="white" fontWeight="bold"
              >
Cerrar sesión
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
            {activeScreen === "productos" && <Productos productos={productos} categorias={categorias} modelos={modelos_celulares} onDelete={handleDeleteProduct} fetchProductos={fetchProductos} />}
          </Box>
        </Box>
      //</Box>
    //</ChakraProvider>
  );
}

export default Dashboard;
