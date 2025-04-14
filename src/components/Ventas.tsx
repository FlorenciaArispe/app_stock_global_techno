import { useState } from "react";
import {
  Box, Button, FormControl, Input,
  Table, Thead, Tbody, Tr, Th, Td,
  Text, useToast,
  useDisclosure,
  Flex,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";
import ModalConfirmacionDelete from "./ModalConfirmacionDelete";
import { CardMobileVentas } from "./CardMobileVentas";
import NewVenta from "./NewVenta";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import { deleteVenta } from "../supabase/ventas.service";
import { Modelo, Producto, Venta } from "../types";
import { fetchVentas } from "../services/fetchData";

interface VentasProps {
  productos: Producto[];
  modelos: Modelo[];
  ventas: Venta[];
}

const Ventas = ({ productos, modelos, ventas }: VentasProps) => {
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedVentaId, setSelectedVentaId] = useState<number>();
  const [mostrarBuscador, setMostrarBuscador] = useState(false);
  const {
    isOpen: isOpenNewVenta,
    onOpen: openNewVenta,
    onClose: closeConfirmNewVenta,
  } = useDisclosure();
  const isMobile = useBreakpointValue(
    { base: true, xl: false },
    { fallback: "base" }
  );

  const onDelete = async () => {
    try {
      await deleteVenta(Number(selectedVentaId));
      toast({
        title: "Venta eliminada",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await fetchVentas();
    } catch (error) {
      toast({
        title: "Error al eliminar",
        description: "Ocurrió un problema al eliminar la venta.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const ventasFiltradas = ventas.filter((venta : Venta) => {
    const coincideNombre = filtroNombre
      ? venta.productos.some((p) =>
        p.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
      )
      : true;
      const coincideFecha = filtroFecha
  ? venta.fecha_venta.slice(0, 10) === filtroFecha
  : true;
    
    return coincideNombre && coincideFecha;
  });

  const handleDeleteConfirm = () => {
    onDelete()
  }

  return (
    <Box p={{ base: 0, md: 5 }}>
      <Flex mb={5}>
        <Button
          w={{ base: "100%", md: "190px" }}
          p={2}
          colorScheme="green"
          size={{ base: "sm", md: "md" }}
          leftIcon={<AddIcon />}
          onClick={() => openNewVenta()}
        >
          <Box>Registrar Venta</Box>
        </Button>
      </Flex>

      <NewVenta
        modelos={modelos}
        productos={productos}
        isOpen={isOpenNewVenta}
        onClose={closeConfirmNewVenta}
      />
      <Box bg={{ xl: "white" }} p={{ base: 0, xl: 5 }} borderRadius={{ base: 0, xl: "md" }} boxShadow={{ base: 0, xl: "md" }}>
        <Flex alignItems={"center"} mb={3}>
          <Text mr={1} fontSize={{ base: "18", md: "20px" }} fontWeight="bold" color={"gray.800"}>
            Ventas Registradas
          </Text>
          <IconButton
            icon={<SearchIcon />}
            aria-label="Buscar"
            size="sm"
            onClick={() => setMostrarBuscador((prev) => !prev)}
          />
        </Flex>

        {mostrarBuscador && (
          <Flex direction={"row"} gap={1} mb={1}>
            <FormControl>
              <Input
                mb={2}
                borderRadius="7px"
                placeholder="Buscar modelo"
                size="sm"
                w="100%"
                bg="white"
                value={filtroNombre}
                onChange={(e) => setFiltroNombre(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                mb={2}
                borderRadius="7px"
                size="sm"
                w="100%"
                bg="white"
                type="date"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
              />
            </FormControl>
          </Flex>
        )}

        {!isMobile ? (
          <Box overflowY="auto">
            <Table size="sm">
              <Thead position="sticky" top={0} bg="white" zIndex={1}>
                <Tr >
                  <Th fontSize={"15px"}>Fecha</Th>
                  <Th fontSize={"15px"}>Cliente</Th>
                  <Th fontSize={"15px"}>Productos</Th>
                  <Th textAlign={"center"} fontSize={"15px"}>Total</Th>
                  <Th textAlign={"center"} fontSize={"15px"}>Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {ventasFiltradas?.map((venta, index) => (
                  <Tr key={index} height="60px">
                    <Td>{venta.fecha_venta}</Td>
                    <Td>{venta.cliente || "Sin registro"}</Td>
                    <Td>
                      <Flex
                        direction={{ base: 'column', md: 'row' }}
                        flexWrap="wrap"
                        gap={4}
                      >
                        {venta.productos.map((p, i) => (
                          <Box key={i} mb={{ base: 2, md: 0 }}>
                            <Text>{`${p.nombre} ${p.descripcion ?? ""} x ${p.cantidad} ($${p.subtotal})`}</Text>
                            {p.imei && (
                              <Text fontSize="sm" color="gray.500" ml={{ base: 2, md: 0 }} mt={{ base: 0, md: 1 }}>
                                IMEI: {p.imei}
                              </Text>
                            )}
                          </Box>
                        ))}
                      </Flex>
                    </Td>
                    <Td textAlign={"center"}>${venta.total}</Td>
                    <Td>
                      <Flex justifyContent={"center"} gap={2}>
                        <IconButton
                          icon={<MdDelete />}
                          onClick={() => {
                            setSelectedVentaId(venta.id);
                            onOpen();
                          }}
                          aria-label="Eliminar"
                          size="sm"
                          color="red.500"
                          variant="ghost"
                        />
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        ) : (
          <Box w={"100%"}>
            {ventasFiltradas?.map((venta, index) => (
              <CardMobileVentas key={index} venta={venta} onOpen={onOpen} setSelectedVentaId={setSelectedVentaId} />
            ))}
          </Box>
        )}

      </Box>

      <ModalConfirmacionDelete isOpen={isOpen} onClose={onClose} handleDeleteConfirm={handleDeleteConfirm} />
    </Box>
  );
};

export default Ventas;
