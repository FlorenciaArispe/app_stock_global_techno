import { useState } from "react";
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

const celularesNuevos = [
  { id: 1, modelo: "14 Pro", capacidad: "256GB", stock: 10, color: "Negro", valorNeto: 800, mayorista: 950, minorista: 1100 },
  { id: 2, modelo: "13", capacidad: "512GB", stock: 5, color: "Verde", valorNeto: 700, mayorista: 850, minorista: 1000 },
  { id: 3, modelo: "14 Pro", capacidad: "256GB", stock: 10, color: "Negro", valorNeto: 800, mayorista: 950, minorista: 1100 },
  { id: 4, modelo: "13", capacidad: "512GB", stock: 5, color: "Verde", valorNeto: 700, mayorista: 850, minorista: 1000 },
  { id: 5, modelo: "14 Pro", capacidad: "256GB", stock: 10, color: "Negro", valorNeto: 800, mayorista: 950, minorista: 1100 },
  { id: 6, modelo: "13", capacidad: "512GB", stock: 5, color: "Verde", valorNeto: 700, mayorista: 850, minorista: 1000 },
  { id: 7, modelo: "14 Pro", capacidad: "256GB", stock: 10, color: "Negro", valorNeto: 800, mayorista: 950, minorista: 1100 },
  { id: 8, modelo: "13", capacidad: "512GB", stock: 5, color: "Verde", valorNeto: 700, mayorista: 850, minorista: 1000 },
  { id: 9, modelo: "14 Pro", capacidad: "256GB", stock: 10, color: "Negro", valorNeto: 800, mayorista: 950, minorista: 1100 },
  { id: 10, modelo: "13", capacidad: "512GB", stock: 5, color: "Verde", valorNeto: 700, mayorista: 850, minorista: 1000 },
  { id: 11, modelo: "14 Pro", capacidad: "256GB", stock: 10, color: "Negro", valorNeto: 800, mayorista: 950, minorista: 1100 },
  { id: 12, modelo: "13", capacidad: "512GB", stock: 5, color: "Verde", valorNeto: 700, mayorista: 850, minorista: 1000 },
  { id: 13, modelo: "14 Pro", capacidad: "256GB", stock: 10, color: "Negro", valorNeto: 800, mayorista: 950, minorista: 1100 },
  { id: 14, modelo: "13", capacidad: "512GB", stock: 5, color: "Verde", valorNeto: 700, mayorista: 850, minorista: 1000 },
];

const celularesUsados = [
  { id: 3, modelo: "12", capacidad: "128GB", stock: 4, color: "Azul", valorNeto: 500, mayorista: 650, minorista: 800 },
  { id: 4, modelo: "15 Pro", capacidad: "256GB", stock: 6, color: "Negro", valorNeto: 900, mayorista: 1050, minorista: 1200 },
];;

const accesorios = [
  { id: 1, nombre: "Cargador Rápido", stock: 20 , valorNeto: 700, mayorista: 850, minorista: 1000},
  { id: 2, nombre: "Funda iPhone 14", stock: 15 , valorNeto: 700, mayorista: 850, minorista: 1000},
];

const categorias= [
  {id:1 , nombre: "Celular Usado"},
  {id:2 , nombre: "Celular Nuevo"},
  {id:3, nombre: "Accesorio"}
]


function App() {
  const [activeScreen, setActiveScreen] = useState("ventas");
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <ChakraProvider>
      <Box bg="#154273" minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Box bg="#f4f6f9" w="calc(100% - 30px)" h="calc(100vh - 40px)" borderRadius="lg" boxShadow="lg">
          {/* Navbar */}
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

          {/* Drawer Menu (Móvil) */}
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

          {/* Contenido dinámico según activeScreen */}
          <Box p={5}>
            {activeScreen === "ventas" && <Ventas celularesNuevos={celularesNuevos} celularesUsados={celularesUsados} accesorios={accesorios} />}
            {activeScreen === "productos" && <Productos celularesNuevos={celularesNuevos} celularesUsados={celularesUsados} accesorios={accesorios} categorias={categorias} />}
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
