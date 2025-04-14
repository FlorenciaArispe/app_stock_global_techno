import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Radio, RadioGroup, Text, useDisclosure, useToast, VStack } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { Modelo, Producto } from '../types';
import { createVenta } from '../supabase/ventas.service';
import { deleteProducto, updateStockProducto } from '../supabase/productos.service';
import { fetchProductos, fetchVentas } from '../services/fetchData';

const RegistrarVentaEnProductos = ({ isOpen, onClose, stockNuevo, productoNewVenta, modelos }: any) => {
  const toast = useToast();
  const [productoSeleccionado, setProductoSeleccionado] = useState({
    fecha_venta: new Date().toISOString().split("T")[0],
    cliente: "",
    tipoVenta: "minorista",
    imei: ""
  });
    const cancelRef = useRef(null);
   const {
      isOpen: isConfirmDialogOpen,
      onOpen: openConfirmDialog,
      onClose: closeConfirmDialog,
    } = useDisclosure();

  const handleChange = (field: string, value: string) => {
    setProductoSeleccionado((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const guardarVenta = async () => {
    console.log("Producto seleccionado:", productoSeleccionado);
    const total = productoSeleccionado.tipoVenta === "minorista" ? productoNewVenta.minorista : productoNewVenta.mayorista

    const productoFormateado = [{
      nombre: obtenerNombreProducto(productoNewVenta),
      cantidad: 1,
      subtotal: total,
      imei: productoSeleccionado.imei,
      descripcion: productoNewVenta.color ? `${productoNewVenta.capacidad} - ${productoNewVenta.color}` : ""
    }]
    try {
      await createVenta({
        fecha_venta: productoSeleccionado.fecha_venta,
        cliente: productoSeleccionado.cliente,
        productos: productoFormateado,
        total,
      });

      if (stockNuevo <= 0) {
        openConfirmDialog()
      } else {
        await updateStockProducto(Number(productoNewVenta.id), stockNuevo);
        toast({
          title: "Venta registrada",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        await fetchProductos();
        await fetchVentas();
        onClose();
      }
      setProductoSeleccionado({
        fecha_venta: new Date().toISOString().split("T")[0],
        cliente: "",
        tipoVenta: "minorista",
        imei: ""
      });
     
    } catch (error) {
      toast({
        title: "Error al registrar venta",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  const obtenerNombreProducto = (producto: Producto) => {
    if (producto.categoria === 3) {
      return producto.nombre || "Accesorio sin nombre";
    }
    if (producto.modeloId) {
      const modelo = modelos.find((m: Modelo) => m.id == producto.modeloId);
      return modelo
        ? `${modelo.nombre}`
        : "Modelo no encontrado";
    }
    return "Producto sin datos";
  };

   const handleDelete = async () => {
      await deleteProducto(productoNewVenta.id);
      toast({
        title: "Venta registrada",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

   
      await fetchProductos();
      await fetchVentas();
      onClose();
      closeConfirmDialog()
    }

  return (
    <>
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", md: "xl" }}>
      <ModalOverlay />
      <ModalContent
        mt={{ base: '0', md: '5', lg: '20' }}
        borderTopRadius={{ base: '0', md: 'md' }}
      >
        <ModalHeader>Agregar Nueva Venta</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
        
          <Box p={2} mb={3}>
            <Flex flexDirection={"row"} gap={{ base: 2, md: 6 }}>
              <FormControl mb={4}>
                <FormLabel fontWeight={600}>Producto</FormLabel>
                <Text>{`${productoNewVenta.nombre ?? ""} ${productoNewVenta.modelo ?? ""} ${productoNewVenta.capacidad ?? ""} ${productoNewVenta.color ?? ""}`}</Text>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel fontWeight={600}>Cantidad</FormLabel>
                <Text>1 </Text>
              </FormControl>
            </Flex>
            <Flex flexDirection={"row"} gap={{ base: 2, md: 6 }}>
            <FormControl mb={4}>
              <FormLabel fontWeight={600}>Fecha de Venta</FormLabel>
              <Input type="date" value={productoSeleccionado.fecha_venta} onChange={(e) => handleChange("fecha_venta", e.target.value)} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel  fontWeight={600}>Cliente</FormLabel>
              <Input type="text" value={productoSeleccionado.cliente} placeholder='Cliente' onChange={(e) => handleChange("cliente", e.target.value)} />
            </FormControl>
          </Flex>
            <Flex flexDirection={"row"} gap={{ base: 2, md: 6 }}>
              <FormControl>
                <FormLabel fontWeight={600}>Tipo de Venta</FormLabel>
                <RadioGroup
                  value={productoSeleccionado.tipoVenta}
                  onChange={(value) => handleChange("tipoVenta", value)}
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
                  value={productoSeleccionado.imei}
                  onChange={(e) => handleChange("imei", e.target.value)}
                  isDisabled={
                    productoNewVenta.categoria == 3
                  }
                />
              </FormControl>
            </Flex>
          </Box>
          <Flex justify={"flex-end"} mt={10}>
            <Button
              onClick={guardarVenta}
              colorScheme={"green"}
            >
              Registrar Venta
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>

     {isConfirmDialogOpen && (
            <AlertDialog
              isOpen={isConfirmDialogOpen}
              leastDestructiveRef={cancelRef}
              onClose={closeConfirmDialog}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  <Text>{`${productoNewVenta.nombre ?? ""} ${productoNewVenta.modelo ?? ""} ${productoNewVenta.capacidad ?? ""} ${productoNewVenta.color ?? ""}`}</Text>
                  </AlertDialogHeader>
                  <AlertDialogBody>
                    ¿Estás seguro de que ya no hay stock de este producto?
                  </AlertDialogBody>
                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={closeConfirmDialog}>
                      Cancelar
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={() => handleDelete()}
                      ml={3}
                    >
                      Aceptar
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          )}
          </>
    
  );
}

export default RegistrarVentaEnProductos;
