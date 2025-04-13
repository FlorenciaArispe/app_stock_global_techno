import {
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { HiMenu, HiOutlineLogout } from "react-icons/hi";
import Ventas from "./components/Ventas";
import Productos from "./components/Productos";
import { deleteProducto } from "./supabase/productos.service";
import supabase from "./supabase/supabase.service";
import { FaUser } from "react-icons/fa";
import { Modelo, Producto, Venta } from "./types";
import { fetchProductos } from "./services/fetchData";
import { useState } from "react";

interface DashboardProps {
  productos: Producto[];
  ventas: Venta[];
  modelos: Modelo[];
}

function Dashboard({
  productos,
  ventas,
  modelos,
}: DashboardProps) {
  const [activeScreen, setActiveScreen] = useState("ventas");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDeleteProduct = async (id: number): Promise<void> => {
    await deleteProducto(id)
    await fetchProductos()
  }

  return (
    <Box bg="gray.100" h={"100vh"} overflowY="scroll"
      css={{
        scrollbarWidth: "none", 
        "&::-webkit-scrollbar": {
          display: "none", 
        },
      }}>
      <Flex bg="gray.800" p={4} align="center" justify="space-between" w={"100%"} h={{ base: "60px", md: "72px" }}>
        <Text ml={{ base: 1, md: 4 }} fontSize={{ base: "18px", md: "22px" }} fontWeight="bold" color="white">
          Stock Global Technology
        </Text>
        <Flex display={{ base: "none", md: "flex" }} gap={1} >
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
          <Menu>
            <MenuButton
              ml={4}
              as={IconButton}
              icon={<FaUser />}
              variant="ghost"
              color="white"
              _hover={{ bg: "gray.700" }}
              _active={{ bg: "gray.600" }}
            />
            <MenuList>
              <MenuItem
                icon={<HiOutlineLogout />}
                onClick={() => supabase.auth.signOut()}
              >
                Cerrar sesión
              </MenuItem>
            </MenuList>
          </Menu>
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
              <Text textAlign={"center"} ml={{ base: 1, md: 4 }} fontSize={{ base: "18px", md: "22px" }} fontWeight="bold" color="white">
                Stock Global Technology
              </Text>
              <Button mt={4} w="100%" variant="ghost" color="white" fontWeight="bold"
                onClick={() => { setActiveScreen("ventas"); onClose(); }}>
                Ventas
              </Button>
              <Button mb={4} w="100%" variant="ghost" color="white" fontWeight="bold"
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

      <Box p={5} bg={"gray.100"}>
        {activeScreen === "ventas" && <Ventas productos={productos} modelos={modelos} ventas={ventas} />}
        {activeScreen === "productos" && <Productos productos={productos} modelos={modelos} onDelete={handleDeleteProduct} />}
      </Box>
    </Box>
  );
}

export default Dashboard;
