import { Box, Button, Flex, FormControl, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Radio, RadioGroup, Select, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { MdClose } from 'react-icons/md';

const RegistrarVentaEnProductos = ({isOpen, onClose, stockNuevo ,productoNewVenta}: any) => {
      const [fecha_venta, setFecha] = useState(new Date().toISOString().split("T")[0]);
      const [cliente, setCliente] = useState("");


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

                 <Flex flexDirection={"row"} gap={{ base: 2, md: 6 }}>
                   <FormControl mb={4}>
                     <FormLabel>Producto</FormLabel>
                     <Text>{productoNewVenta.modelo} </Text>
                   </FormControl>
                   <FormControl mb={4}>
                     <FormLabel>Cliente</FormLabel>
                     <Input type="text" value={cliente} onChange={(e) => setCliente(e.target.value)} />
                   </FormControl>
                 </Flex>
                 <Box
                  p={2}
                //    borderWidth={productosSeleccionados.length > 0 ? "1px" : "0"}
                    borderColor="gray.200"
                     borderRadius="md"
                      mb={3}>
                   {/* {productosSeleccionados.map((prod, index) => ( */}
                     <HStack
                       flexDirection={{ base: "column", md: "row" }}
                       spacing={2}
                       align="start"
                       p={3}
                       borderBottom="1px solid #ddd"
                       position="relative"
                     >
                       {/* <Button
                         size="xs"
                         colorScheme="red"
                         onClick={() => eliminarProducto(index)}
                         position="absolute"
                         top="2"
                         right="2"
                         zIndex="1"
                       >
                         <MdClose />
                       </Button> */}
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
                         <FormLabel>Cantidad</FormLabel>
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
                             const p = productos.find((p: Producto) => p.id == Number(prod.id));
                             return p?.categoria === 3;
                           })()}
                         />
                       </FormControl>
                     </HStack>
                {/* //    ))} */}
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
                       errorCantidad !== ""
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

export default RegistrarVentaEnProductos;
