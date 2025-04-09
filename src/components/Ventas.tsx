import { useState } from "react";
import {
  Box, Button, FormControl, FormLabel, Input, Select,
  Table, Thead, Tbody, Tr, Th, Td, RadioGroup, Radio,
  HStack, Text, useToast,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { MdClose } from "react-icons/md";
import { createVenta, deleteVenta, updateVenta } from "../supabase/ventas.service";
import ModalConfirmacionDelete from "./ModalConfirmacionDelete";

const Ventas = ({ productos, modelos, ventas, fetchVentas }: any) => {
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [fecha_venta, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedVentaId, setSelectedVentaId] = useState();
    const [ventaEditando, setVentaEditando] = useState<number | null>(null);

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
      };
    });
    console.log("producto formateado", productosFormateados)
    const total = calcularTotal();

    try {

      await createVenta({
        fecha_venta,
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
    if (producto.categoria === 3) {
      return producto.nombre || "Accesorio sin nombre";
    }
    if (producto.modeloId) {
      const modelo = modelos.find((m) => m.id === producto.modeloId);
      return modelo
        ? `${modelo.nombre} ${producto.capacidad} - ${producto.color}`
        : "Modelo no encontrado";
    }
  
    return "Producto sin datos";
  };

  const editarVenta = (venta) => {
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
        productos: productosFormateados,
        total,
      });
  
      toast({
        title: "Venta actualizada",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
  
      // Limpieza
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
    <Box p={5}>
      <Box bg="white" p={5} borderRadius="md" boxShadow="md" mb={5}>
        <FormControl mb={4}>
          <FormLabel>Fecha de Venta</FormLabel>
          <Input type="date" value={fecha_venta} onChange={(e) => setFecha(e.target.value)} />
        </FormControl>

        <Box maxHeight="250px" overflowY="auto" p={2} borderWidth={productosSeleccionados.length > 0 ? "1px" : "0"} borderColor="gray.200" borderRadius="md" mb={3}>
          {productosSeleccionados.map((prod, index) => (
            <HStack key={index} spacing={4} align="start" p={3} borderBottom="1px solid #ddd">
              <FormControl>
                <FormLabel>Producto</FormLabel>
                <Select
                  placeholder="Seleccionar producto"
                  value={prod.id}
                  onChange={(e) => actualizarProducto(index, "id", e.target.value)}
                >
                  {productos.map((producto) => (
                    <option key={producto.id} value={producto.id}>
                      {obtenerNombreProducto(producto)} - Stock: {producto.stock}
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
    <VStack align="start" spacing={1}>
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

              <Button size="sm" colorScheme="red" onClick={() => eliminarProducto(index)}>
                <MdClose />
              </Button>
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
  <Text fontSize="xl" mb={4} fontWeight="bold" color={"gray.800"}>
    Ventas Registradas
  </Text>

  <Box maxH="450px" overflowY="auto">
    <Table size="sm">
      <Thead position="sticky" top={0} bg="white" zIndex={1}>
        <Tr >
          <Th fontSize={"15px"}>Fecha</Th>
          <Th fontSize={"15px"}>Productos</Th>
          <Th fontSize={"15px"}>Total</Th>
          <Th fontSize={"15px"}>Acciones</Th>
        </Tr>
      </Thead>
      <Tbody>
        {ventas?.map((venta, index) => (
          <Tr key={index} height="60px">
            <Td>{new Date(venta.fecha_venta).toLocaleDateString("es-AR")}</Td>
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
            <Td>${venta.total}</Td>
            <Td>
  <Button
    size="xs"
    colorScheme="yellow"
    onClick={() => editarVenta(venta)}
  >
    Editar
  </Button>
  <Button
    size="xs"
    colorScheme="red"
    ml={2}
    onClick={() => {
      setSelectedVentaId(venta.id);
      onOpen();
    }}

  >
    Eliminar
  </Button>
</Td>

          </Tr>
        ))}
      </Tbody>
    </Table>
  </Box>
</Box>

  <ModalConfirmacionDelete isOpen ={isOpen} onClose={onClose} handleDeleteConfirm={handleDeleteConfirm} />

    </Box>
  );
};

export default Ventas;
