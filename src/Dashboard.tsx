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
import { getModelos } from "./supabase/modelo.service";

const categorias= [
  {id:1 , nombre: "Celular Nuevo"},
  {id:2 , nombre: "Celular Usado"},
  {id:3, nombre: "Accesorio"}
]


function Dashboard (onLogout : any) {
  const [activeScreen, setActiveScreen] = useState("ventas");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [productos, setProductos]= useState([]);
  const [modelos, setModelos]= useState([]);

  async function fetchProductos() {
    const { data, error } = await supabase.from('productos').select('*');
    
    if (error) {
      if (error.message === "JWT expired") {
        await supabase.auth.signOut();
        return;
      }
      console.error(error);
    }
    
    setProductos(data || []);
  }
  
  async function fetchModelos() {
    const { data, error } = await supabase.from('Modelo_celular').select('*');
  
    if (error) {
      if (error.message === "JWT expired") {
        await supabase.auth.signOut();
        return;
      }
      console.error(error);
    }
  
    setModelos(data || []);
  }
  

  useEffect(() =>{
    fetchProductos()
    fetchModelos()

  } , [])

  const handleDeleteProduct = async (id : number)=>{
    await deleteProducto(id)
    await fetchProductos()
  }


  return (
    //<ChakraProvider>
     // <Box bg="#154273" minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Box bg="gray.100" h={"100vh"}>
          <Flex bg="gray.800" p={4} align="center" justify="space-between">
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
              <DrawerContent bg="gray.800">
                <DrawerBody>
                  <Button w="100%" mb={4} variant="ghost" color="white" fontWeight="bold"
                    onClick={() => { setActiveScreen("ventas"); onClose(); }}>
                    Ventas
                  </Button>
                  <Button w="100%" variant="ghost" color="white" fontWeight="bold"
                    onClick={() => { setActiveScreen("productos"); onClose(); }}>
                    Productos
                  </Button>
                  <Button w="100%" variant="ghost" color="white" fontWeight="bold"
                     onClick={() => supabase.auth.signOut()}>
                    Cerrar sesión
                  </Button>
                 
                </DrawerBody>
              </DrawerContent>
            </DrawerOverlay>
          </Drawer>

          <Box p={5}>
            {activeScreen === "ventas" && <Ventas productos={productos} modelos={modelos} />}
            {activeScreen === "productos" && <Productos productos={productos} categorias={categorias} modelos={modelos} onDelete={handleDeleteProduct} fetchProductos={fetchProductos} fetchModelos={fetchModelos} />}
          </Box>
        </Box>
      //</Box>
    //</ChakraProvider>
  );
}

export default Dashboard;
