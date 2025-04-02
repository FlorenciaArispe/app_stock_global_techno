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
import Productos from "./components/productos";


function App() {
  const [activeScreen, setActiveScreen] = useState("ventas");
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <ChakraProvider>
      <Box bg="#154273" minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Box bg="#f4f6f9" w="calc(100% - 30px)" h="calc(100vh - 30px)" borderRadius="lg" boxShadow="lg">
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
            {activeScreen === "ventas" && <Ventas />}
            {activeScreen === "productos" && <Productos />}
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
