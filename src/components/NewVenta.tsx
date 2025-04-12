import { Box, Button, Flex, FormControl, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Radio, RadioGroup, Select, Text, useToast, VStack } from '@chakra-ui/react';
import { MdClose } from 'react-icons/md';
import { deleteProducto, updateStockProducto } from '../supabase/productos.service';
import { useState } from 'react';
import { createVenta } from '../supabase/ventas.service';

const NewVenta = ({ fetchProductos, fetchVentas, modelos, productos, isOpen, onClose }: any) => {
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [fecha_venta, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [cliente, setCliente] = useState("");
  const [errorCantidad, setErrorCantidad] = useState<string | null>(null);
  const toast = useToast();

  const agregarProducto = () => {
    setProductosSeleccionados([
      ...productosSeleccionados,
      { id: "", cantidad: "", tipoVenta: "minorista", imei: "" },
    ]);
  };

  const actualizarProducto = (index, key, value) => {
    const nuevosProductos = [...productosSeleccionados];
    nuevosProductos[index][key] = value;
    setProductosSeleccionados(nuevosProductos);
  };

  const guardarVenta = async () => {
    for (const p of productosSeleccionados) {
      if (!p.cantidad || p.cantidad <= 0) {
        setErrorCantidad("La cantidad no puede ser 0");
        return; 
      }
    }
    setErrorCantidad(null);

    const productosFormateados = productosSeleccionados.map((p) => {
      const producto = productos.find((prod) => prod.id == p.id);
      const precio = p.tipoVenta === "mayorista" ? producto.mayorista : producto.minorista;
      return {
        nombre: obtenerNombreProducto(producto),
        cantidad: p.cantidad,
        subtotal: precio * p.cantidad,
        imei: p.imei || "",
        descripcion: p.color ? `${p.capacidad} - ${p.color}` : "",
      };
    });

    const total = calcularTotal();

    try {
      await createVenta({
        fecha_venta,
        cliente,
        productos: productosFormateados,
        total,
      });

      for (const p of productosSeleccionados) {
        const producto = productos.find((prod) => prod.id === Number(p.id));
        if (producto) {
          const nuevoStock = producto.stock - p.cantidad;

          if (nuevoStock <= 0) {
            await deleteProducto(p.id);
          } else {
            await updateStockProducto(p.id, nuevoStock);
          }
        }
      }

      toast({
        title: "Venta registrada",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setProductosSeleccionados([]);
      setFecha(new Date().toISOString().split("T")[0]);
      fetchProductos();
      fetchVentas();
      onClose();
    } catch (error) {
      toast({
        title: "Error al registrar venta",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
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

  const obtenerNombreProducto = (producto) => {
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

  const getStockProducto = (productoId) => {
    const producto = productos.find((p) => p.id === Number(productoId));
    return producto ? producto.stock : 1;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", md: "xl" }}>
      <ModalOverlay />
      <ModalContent
        mt={{ base: '0', md: '5', lg: '20' }}
        borderTopRadius={{ base: '0', md: 'md' }}
      >
        <ModalHeader>Agregar Nueva Venta</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex flexDirection={"row"} gap={{ base: 2, md: 6 }}>
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
                position="relative"
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
                <FormControl isInvalid={prod.cantidad > prod.stock}>
                  <FormLabel>Cantidad</FormLabel>
                  <Input
                    type="number"
                    value={prod.cantidad}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      setErrorCantidad(null)
                      actualizarProducto(index, "cantidad", value);
                    }}
                  />
                  {prod.cantidad > getStockProducto(prod.id) && (
                    <Text fontSize="sm" color="red.500" mt={1}>
                      No hay ese stock disponible
                    </Text>
                  )}
                  {errorCantidad && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errorCantidad}
                    </Text>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel>Tipo de Venta</FormLabel>
                  <RadioGroup
                    value={prod.tipoVenta}
                    onChange={(value) => actualizarProducto(index, "tipoVenta", value)}
                  >
                    <VStack flexDirection={{ base: "row", md: "column" }} align="start" spacing={1}>
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
                      return p?.categoria === 3;
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
                productosSeleccionados.some((p) => p.id === "") ||
                productosSeleccionados.some(p => p.cantidad > getStockProducto(p.id)) ||
                errorCantidad
              }
              onClick={guardarVenta}
              colorScheme={"green"}
            >
              Registrar Venta
            </Button>
          </HStack>

          {calcularTotal() !== 0 && (
            <Box mt={4} fontWeight="bold">
              Total: ${calcularTotal()}
            </Box>
          )}

        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default NewVenta;
