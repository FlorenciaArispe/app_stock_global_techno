import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  RadioGroup,
  Radio,
  HStack,
  Text,
} from "@chakra-ui/react";
import { MdClose } from "react-icons/md";

const Ventas = ({ productos, modelos }: any) => {
  const [ventas, setVentas] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [ventaEditando, setVentaEditando] = useState(null);
  const [producto, setProducto] = useState("")

  const agregarProducto = () => {
    setProductosSeleccionados([
      ...productosSeleccionados,
      { id: "", cantidad: 1, tipoVenta: "minorista" },
    ]);
  };

  const actualizarProducto = (index, key, value) => {
    setProducto(value)
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
      const cantidad = prod.cantidad || 1; // si cantidad es falsy (undefined, null, 0, ""), usa 1
      return total + precio * cantidad;
    }, 0);
  };
  

  const guardarVenta = () => {
    if (ventaEditando !== null) {
      const ventasActualizadas = ventas.map((venta, index) =>
        index === ventaEditando
          ? { fecha, productos: productosSeleccionados, total: calcularTotal() }
          : venta
      );
      setVentas(ventasActualizadas);
      setVentaEditando(null);
    } else {
      setVentas([
        ...ventas,
        { fecha, productos: productosSeleccionados, total: calcularTotal() },
      ]);
    }
    setProductosSeleccionados([]);
  };

  const editarVenta = (index) => {
    const venta = ventas[index];
    setFecha(venta.fecha);
    setProductosSeleccionados(venta.productos);
    setVentaEditando(index);
  };

  const eliminarVenta = (index) => {
    setVentas(ventas.filter((_, i) => i !== index));
  };

  const obtenerNombreProducto = (producto) => {
    if (producto.modeloId) {
      const modelo = modelos.find((m) => m.id === producto.modeloId);
      return modelo ? `${modelo.nombre} ${producto.capacidad} - ${producto.color}` : "Modelo no encontrado";
    }
    return producto.nombre || "Producto sin nombre";
  };

  return (
    <Box p={5}>
      <Box bg="white" p={5} borderRadius="md" boxShadow="md" mb={5}>
        <FormControl mb={4}>
          <FormLabel>Fecha de Venta</FormLabel>
          <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </FormControl>

        <Box maxHeight="250px" overflowY="auto" p={2} border="1px solid #ddd" borderRadius="md" mb={3}>
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
                  onChange={(e) =>
                    actualizarProducto(index, "cantidad", parseInt(e.target.value, 10))
                  }
                />
              </FormControl>

              <FormControl>
                <FormLabel>Tipo de Venta</FormLabel>
                <RadioGroup
                  value={prod.tipoVenta}
                  onChange={(value) => actualizarProducto(index, "tipoVenta", value)}
                >
                  <HStack spacing={4}>
                    <Radio value="minorista">Minorista</Radio>
                    <Radio value="mayorista">Mayorista</Radio>
                  </HStack>
                </RadioGroup>
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
          <Button isDisabled={productosSeleccionados.length === 0 || producto === ""} onClick={guardarVenta} colorScheme="green">
            {ventaEditando !== null ? "Actualizar Venta" : "Registrar Venta"}
          </Button>
        </HStack>

        <Box mt={4} fontWeight="bold">
          Total: ${calcularTotal()}
        </Box>
      </Box>

      <Box bg="white" p={5} borderRadius="md" boxShadow="md">
        <Text fontSize="xl" mb={4} fontWeight="bold">
          Ventas Registradas
        </Text>
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Fecha</Th>
              <Th>Productos</Th>
              <Th>Total</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody
          
          >
            {ventas.map((venta, index) => (
              <Tr key={index}>
                <Td>{venta.fecha}</Td>
                <Td>
                  {venta.productos.map((p, i) => {
                    const producto = productos.find((prod) => prod.id == p.id);
                    return (
                      <Box key={i}>
                        {producto
                          ? `${obtenerNombreProducto(producto)} x ${p.cantidad ? p.cantidad : 1} (${p.tipoVenta})`
                          : "Producto eliminado"}
                      </Box>
                    );
                  })}
                </Td>
                <Td>${venta.total}</Td>
                <Td>
                  <Button size="xs" colorScheme="yellow" onClick={() => editarVenta(index)}>
                    Editar
                  </Button>
                  <Button size="xs" colorScheme="red" ml={2} onClick={() => eliminarVenta(index)}>
                    Eliminar
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default Ventas;
