import { useState } from "react";
import {
  Box, Button, FormControl, FormLabel, Input, Select,
  Table, Thead, Tbody, Tr, Th, Td, RadioGroup, Radio,
  HStack, Text, useToast,
  VStack,
  useDisclosure,
  Flex,
  Tooltip,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { MdClose, MdDelete, MdEdit } from "react-icons/md";
import { createVenta, deleteVenta, updateVenta } from "../supabase/ventas.service";
import ModalConfirmacionDelete from "./ModalConfirmacionDelete";
import { CardMobileVentas } from "./CardMobileVentas";

const Ventas = ({ productos, modelos, ventas, fetchVentas }: any) => {
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [fecha_venta, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [cliente, setCliente]= useState("");
  const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedVentaId, setSelectedVentaId] = useState();
    const [ventaEditando, setVentaEditando] = useState<number | null>(null);
     const isMobile = useBreakpointValue(
        { base: true, xl: false },
        { fallback: "base" }
      );

  const agregarProducto = () => {
    setProductosSeleccionados([
      ...productosSeleccionados,
      { id: "", cantidad: 1, tipoVenta: "minorista", imei: "" },
    ]);
  };
  

  const actualizarProducto = (index, key, value) => {
    const nuevosProductos = [...productosSeleccionados];
    nuevosProductos[index][key] = value;
    setProductosSeleccionados(nuevosProductos);
  };

  const eliminarProducto = (index) => {
    setProductosSeleccionados(productosSeleccionados.filter((_, i) => i !== index));
  };

  const calcularTotal = () => {
    return productosSeleccionados.reduce((total, prod) => {
      const producto = productos.find((p) => p.id == prod.id);
      if (!producto) return total;
      const precio = prod.tipoVenta === "mayorista" ? producto.mayorista : producto.minorista;
      const cantidad = prod.cantidad || 1;
      return total + precio * cantidad;
    }, 0);
  };

  const guardarVenta = async () => {
    const productosFormateados = productosSeleccionados.map((p) => {
      const producto = productos.find((prod) => prod.id == p.id);
      const precio = p.tipoVenta === "mayorista" ? producto.mayorista : producto.minorista;
      return {
        nombre: obtenerNombreProducto(producto),
        cantidad: p.cantidad,
        subtotal: precio * p.cantidad,
        imei: p.imei || "",
        descripcion: p.color ? `${p.capacidad} - ${p.color}` : ""
      };
    });
    console.log("producto formateado", productosFormateados)
    const total = calcularTotal();

    try {

      await createVenta({
        fecha_venta,
        cliente,
        productos: productosFormateados, 
        total,
      });

      toast({
        title: "Venta registrada",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setProductosSeleccionados([]);
      setFecha(new Date().toISOString().split("T")[0]);
      fetchVentas();
    } catch (error) {
      toast({
        title: "Error al registrar venta",
        description: "Verificá los datos y volvé a intentar.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const obtenerNombreProducto = (producto) => {
    console.log(producto)
    if (producto.categoria === 3) {
      return producto.nombre || "Accesorio sin nombre";
    }
    if (producto.modeloId) {
      const modelo = modelos.find((m) => m.id === producto.modeloId);
      return modelo
        ? `${modelo.nombre}`
        : "Modelo no encontrado";
    }
  
    return "Producto sin datos";
  };

  const editarVenta = (venta) => {
    console.log("venta aca",venta)
    setFecha(venta.fecha_venta);
    setProductosSeleccionados(
      venta.productos.map((p) => ({
        id: productos.find(prod => obtenerNombreProducto(prod) === p.nombre)?.id || "",
        cantidad: p.cantidad,
        tipoVenta: "minorista",
        imei: p.imei || ""
      }))
    );
    setVentaEditando(venta.id);
  };
  
  const actualizarVenta = async () => {
    const productosFormateados = productosSeleccionados.map((p) => {
      const producto = productos.find((prod) => prod.id == p.id);
      const precio = p.tipoVenta === "mayorista" ? producto.mayorista : producto.minorista;
      return {
        nombre: obtenerNombreProducto(producto),
        cantidad: p.cantidad,
        subtotal: precio * p.cantidad,
        imei: p.imei || "",
      };
    });
  
    const total = calcularTotal();
  
    try {
      await updateVenta(ventaEditando, {
        fecha_venta,
        cliente,
        productos: productosFormateados,
        total,
      });
  
      toast({
        title: "Venta actualizada",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
  
      setVentaEditando(null);
      setProductosSeleccionados([]);
      setFecha(new Date().toISOString().split("T")[0]);
      fetchVentas();
  
    } catch (error) {
      console.log(error)
      toast({
        title: "Error al actualizar",
        description: "Verificá los datos y volvé a intentar.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
const onDelete = async () => {
  try {
    console.log(selectedVentaId)
    await deleteVenta(selectedVentaId);
    toast({
      title: "Venta eliminada",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    fetchVentas(); 
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

const handleDeleteConfirm = () => {
  onDelete()
}

  return (
    <Box p={{ base: 0, md: 5 }}>
      <Box bg="white" p={5} borderRadius="md" boxShadow="md" mb={5}>
        <Flex flexDirection={"row"} gap={{base: 2, md:6}}>
        <FormControl mb={4}>
          <FormLabel>Fecha de Venta</FormLabel>
          <Input type="date" value={fecha_venta} onChange={(e) => setFecha(e.target.value)} />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Cliente</FormLabel>
          <Input type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} />
        </FormControl>
        </Flex>

        <Box p={2} borderWidth={productosSeleccionados.length > 0 ? "1px" : "0"} borderColor="gray.200" borderRadius="md" mb={3}>
          {productosSeleccionados.map((prod, index) => (
            <HStack
  key={index}
  flexDirection={{ base: "column", md: "row" }}
  spacing={2}
  align="start"
  p={3}
  borderBottom="1px solid #ddd"
  position="relative" // 💥 Esto es clave
>
  <Button
    size="xs"
    colorScheme="red"
    onClick={() => eliminarProducto(index)}
    position="absolute"
    top="2"
    right="2"
    zIndex="1"

  >
    <MdClose />
  </Button>

  <FormControl>
                <FormLabel fontWeight={700}>PRODUCTO</FormLabel>
                <Select
                  placeholder="Seleccionar producto"
                  value={prod.id}
                  onChange={(e) => actualizarProducto(index, "id", e.target.value)}
                >
                  {productos.map((producto) => (
                    <option key={producto.id} value={producto.id}>
                      {obtenerNombreProducto(producto)} {producto.capacidad} {producto.color} - Stock: {producto.stock}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Cantidad</FormLabel>
                <Input
                  type="number"
                  value={prod.cantidad}
                  min="1"
                  onChange={(e) => actualizarProducto(index, "cantidad", parseInt(e.target.value, 10))}
                />
              </FormControl>

              <FormControl>
  <FormLabel>Tipo de Venta</FormLabel>
  <RadioGroup
    value={prod.tipoVenta}
    onChange={(value) => actualizarProducto(index, "tipoVenta", value)}
  >
    <VStack flexDirection={{base: "row", md:"column"}} align="start" spacing={1}>
      <Radio value="minorista">Minorista</Radio>
      <Radio value="mayorista">Mayorista</Radio>
    </VStack>
  </RadioGroup>
</FormControl>


              <FormControl>
  <FormLabel>IMEI</FormLabel>
  <Input
    placeholder="IMEI"
    value={prod.imei}
    onChange={(e) => actualizarProducto(index, "imei", e.target.value)}
    isDisabled={(() => {
      const p = productos.find((p) => p.id == prod.id);
      return p?.categoria === 3; // deshabilita si es accesorio
    })()}
  />
</FormControl>
</HStack>

            
           
          ))}
        </Box>

        <HStack spacing={4}>
          <Button onClick={agregarProducto} colorScheme="blue">
            Agregar Producto
          </Button>
          <Button
            isDisabled={
              productosSeleccionados.length === 0 ||
              productosSeleccionados.some((p) => p.id === "")
            }
            onClick={ventaEditando ? actualizarVenta : guardarVenta}
            colorScheme={ventaEditando ? "yellow" : "green"}
          >
            {ventaEditando ? "Actualizar Venta" : "Registrar Venta"}
          </Button>
        </HStack>

        {calcularTotal() !== 0 && (
  <Box mt={4} fontWeight="bold">
    Total: ${calcularTotal()}
  </Box>
)}
      </Box>

      <Box bg="white" p={5} borderRadius="md" boxShadow="md">
  <Text fontSize={{base:"18", md:"20px"}} mb={4} fontWeight="bold" color={"gray.800"}>
    Ventas Registradas
  </Text>

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
        {ventas?.map((venta, index) => (
          <Tr key={index} height="60px">              
            <Td>{new Date(venta.fecha_venta).toLocaleDateString("es-AR")}</Td>
            <Td>{venta.cliente || "Sin registro"}</Td>
            <Td>
              {venta.productos.map((p, i) => (
                <Box key={i} mb={2} mt={1}>
                  <Text>{`${p.nombre} x ${p.cantidad} ($${p.subtotal})`}</Text>
                  {p.imei && (
                    <Text fontSize="sm" color="gray.500" ml={2}>
                      IMEI: {p.imei}
                    </Text>
                  )}
                </Box>
              ))}
            </Td>
            <Td textAlign={"center"}>${venta.total}</Td>
            <Td>
 <Flex justifyContent={"center"} gap={2}>
                            <IconButton
                              icon={<MdEdit />}
                              aria-label="Editar"
                              size="sm"
                              color="blue.500"
                              variant="ghost"
                              onClick={() => editarVenta(venta)}
                            />
                            <IconButton
                              icon={<MdDelete />}
                              onClick={() => editarVenta(venta)}
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
):(
  <Box w={"100%"}>
  {ventas?.map((venta, index) => (
   
    <CardMobileVentas key={index} venta={venta} editarVenta={editarVenta} />
  ))}
   </Box>

)}
 
</Box>

  <ModalConfirmacionDelete isOpen ={isOpen} onClose={onClose} handleDeleteConfirm={handleDeleteConfirm} />

    </Box>
  );
};

export default Ventas;
