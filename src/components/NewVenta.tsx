import { Box, Button, Flex, FormControl, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Radio, RadioGroup, Select, Text, useToast, VStack } from '@chakra-ui/react';
import { MdClose } from 'react-icons/md';
import { deleteProducto, updateStockProducto } from '../supabase/productos.service';
import { useState } from 'react';
import { createVenta } from '../supabase/ventas.service';
import { Modelo, Producto } from '../types';
import { fetchProductos, fetchVentas } from '../services/fetchData';

interface ProductoSeleccionado {
  id: string;
  cantidad: string;
  tipoVenta: string;
  imei: string;
  descripcion: string;
}

interface NewVentaProps {
  modelos: Modelo[];
  productos: Producto[];
  isOpen: boolean;
  onClose: () => void;
}

const NewVenta = ({ modelos, productos, isOpen, onClose }: NewVentaProps) => {
  const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoSeleccionado[]>([]); 
  const [fecha_venta, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [cliente, setCliente] = useState("");
  const [errorCantidad, setErrorCantidad] = useState<string | null>(null);
  const toast = useToast();

  const agregarProducto = () => {
    setProductosSeleccionados([
      ...productosSeleccionados,
      { id: "", cantidad: "", tipoVenta: "minorista", imei: "" , descripcion: ""},
    ]);
  };

  const actualizarProducto = (index: number, key: keyof ProductoSeleccionado, value: string) => {
    const nuevosProductos = [...productosSeleccionados];
    nuevosProductos[index][key] = value;
    setProductosSeleccionados(nuevosProductos);
  };

  const guardarVenta = async () => {
    for (const p of productosSeleccionados) {
      const cantidad = Number(p.cantidad); 
      if (!cantidad || cantidad <= 0) {
        setErrorCantidad("La cantidad no puede ser 0");
        return; 
      }
    }
    setErrorCantidad(null);

    const productosFormateados = productosSeleccionados.map((p) => {
      const producto = productos.find((prod : Producto) => prod.id == Number(p.id));
      if (!producto) {
        throw new Error(`Producto con ID ${p.id} no encontrado`);
      }
      
      const precio = p.tipoVenta === "mayorista" ? producto.mayorista : producto.minorista;
      const cantidad = Number(p.cantidad); 
  
      return {
        nombre: obtenerNombreProducto(producto),
        cantidad: cantidad,
        subtotal: precio * cantidad,
        imei: p.imei || "",
        descripcion: producto.color ? `${producto.capacidad} - ${producto.color}` : "",
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
        const producto = productos.find((prod : any) => prod.id === Number(p.id));
        if (producto) {
          const cantidad = Number(p.cantidad);
          const nuevoStock = producto.stock - cantidad;
  
          if (nuevoStock <= 0) {
            await deleteProducto(Number(p.id));
          } else {
            await updateStockProducto(Number(p.id), nuevoStock);
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
      setCliente("")
      setFecha(new Date().toISOString().split("T")[0]);
      await fetchProductos();
      await fetchVentas();
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
  

  const eliminarProducto = (index : number) => {
    setProductosSeleccionados(productosSeleccionados.filter((_, i) => i !== index));
  };

  const calcularTotal = () => {
    return productosSeleccionados.reduce((total, prod) => {
      const producto = productos.find((p : Producto) => p.id == Number(prod.id));
      if (!producto) return total;
      const precio = prod.tipoVenta === "mayorista" ? producto.mayorista : producto.minorista;
      const cantidad = prod.cantidad || 1;
      return total + precio * Number(cantidad);
    }, 0);
  };

  const obtenerNombreProducto = (producto : Producto) => {
    if (producto.categoria === 3) {
      return producto.nombre || "Accesorio sin nombre";
    }
    if (producto.modeloId) {
      const modelo = modelos.find((m : Modelo) => m.id == producto.modeloId);
      return modelo
        ? `${modelo.nombre}`
        : "Modelo no encontrado";
    }
    return "Producto sin datos";
  };

  const getStockProducto = (productoId : number) => {
    const producto = productos.find((p) => p.id == Number(productoId));
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
              <FormLabel fontWeight={600}>Fecha de Venta</FormLabel>
              <Input type="date" value={fecha_venta} onChange={(e) => setFecha(e.target.value)} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel fontWeight={600}>Cliente</FormLabel>
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
                    {productos.map((producto : any) => (
                      <option key={producto.id} value={producto.id}>
                        {obtenerNombreProducto(producto)} {producto.capacidad} {producto.color} - Stock: {producto.stock}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight={600}>Cantidad</FormLabel>
                  <Input
                    type="number"
                    value={prod.cantidad}
                    onChange={(e) => {
                      const value =e.target.value;
                      setErrorCantidad(null)
                      actualizarProducto(index, "cantidad", value);
                    }}
                  />
                  {Number(prod.cantidad) > getStockProducto(Number(prod.id)) && (
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
                  <FormLabel fontWeight={600}>Tipo de Venta</FormLabel>
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
                  <FormLabel fontWeight={600}>IMEI</FormLabel>
                  <Input
                    placeholder="IMEI"
                    value={prod.imei}
                    onChange={(e) => actualizarProducto(index, "imei", e.target.value)}
                    isDisabled={(() => {
                      const p = productos.find((p: Producto) => p.id == Number(prod.id));
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
                 productosSeleccionados.some((p : ProductoSeleccionado) => Number(p.cantidad) > getStockProducto(Number(p.id))) ||
                 Boolean(errorCantidad)
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