import { Fragment, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  ButtonGroup,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Tooltip,
} from "@chakra-ui/react";
import { MdDelete, MdEdit, MdExpandLess, MdExpandMore } from "react-icons/md";
import NewProduct from "./NewProduct";
import EditProduct from "./EditProduct";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { updateStockProducto } from "../supabase/productos.service";

function Productos({ productos, categorias, modelos , onDelete , fetchProductos , fetchModelos }: any) {
  const [tipoCelulares, setTipoCelulares] = useState("nuevos");
  const [filaExpandida, setFilaExpandida] = useState<number | null>(null);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const celulares = productos.filter((producto: any) =>
    tipoCelulares === "nuevos"
      ? producto.categoria === 1
      : producto.categoria === 2
  );

  const accesoriosFiltrados = productos.filter(
    (producto: any) => producto.categoria === 3
  );

  const toggleExpandirFila = (id: number) => {
    setFilaExpandida(filaExpandida === id ? null : id);
  };

  const handleDeleteConfirm = () => {
    onDelete(selectedProductId)
  }

  const obtenerNombreModelo = (modeloId: number) => {
    const modelo = modelos.find((m: any) => m.id === modeloId);
    return modelo ? modelo.nombre : "null";
  };

  function handleEditarProducto(producto: any) {
    console.log("producto seleccionado",producto)
    setProductoSeleccionado(producto);
    setIsModalUpdateOpen(true);
  }

 const actualizarStock = async (id, stockNuevo ) =>{
  console.log("ID Y STOCK", id, stockNuevo)

  const res= await updateStockProducto(id, stockNuevo)
  console.log(res)
  fetchProductos()

 }

  return (
    <Box bg={"gray.100"} >
      <Flex mb={5}>
        <Button colorScheme="green" onClick={() => setIsModalOpen(true)}>
          Agregar Producto
        </Button>
      </Flex>

      <Flex
  gap={6}
  justify="center"
  align="start"
  flexDirection={{ base: "column", md: "column", lg:"row" }} 
>

  {/* Card de Celulares */}
  <Card
    w={{ base: "100%", md: "100%", lg: "50%" }} 

    maxH="500px"
    bg="white"
    boxShadow="lg"
    borderRadius="md"
    overflow="hidden"
  >
  <CardHeader>
    <Flex justify="space-between" align="center">
      <Text fontSize="20px" fontWeight="bold">
        Celulares {tipoCelulares === "nuevos" ? "Nuevos" : "Usados"}
      </Text>
      <ButtonGroup isAttached size="sm">
        <Button
          colorScheme={tipoCelulares === "nuevos" ? "blue" : "gray"}
          onClick={() => setTipoCelulares("nuevos")}
        >
          Nuevos
        </Button>
        <Button
          colorScheme={tipoCelulares === "usados" ? "blue" : "gray"}
          onClick={() => setTipoCelulares("usados")}
        >
          Usados
        </Button>
      </ButtonGroup>
    </Flex>
  </CardHeader>

  <CardBody maxH="673px" overflowY="auto" overflowX="hidden">
    <Table variant="simple" width="100%">
      <Thead bg="gray.100">
        <Tr>
         
          <Th textAlign={"center"}>Modelo</Th>
          <Th textAlign={"center"}>Color</Th>
          <Th textAlign={"center"}>Capacidad</Th>
          <Th  textAlign={"center"}>Stock</Th>
          <Th textAlign={"center"}>Acciones</Th>
        
   
        </Tr>
      </Thead>
      <Tbody>
        {celulares.map((producto: any) => (
          <Fragment key={producto.id}>
            <Tr>
              <Td  textAlign={"center"} isTruncated>{obtenerNombreModelo(producto.modeloId)}</Td>
              <Td  p={1} textAlign={"center"}>{producto.color}</Td>
              <Td  p={1} textAlign={"center"}>{producto.capacidad}</Td>
              <Td textAlign="center">
              <Flex justifyContent="center" alignItems="center" gap={2}>
                <IconButton
                  icon={<MinusIcon />}
                  aria-label="Disminuir stock"
                  size="sm"
                  onClick={() => actualizarStock(producto.id, producto.stock - 1)}
                  isDisabled={producto.stock <= 0}
                />
                {producto.stock}
                <IconButton
                  icon={<AddIcon />}
                  aria-label="Aumentar stock"
                  size="sm"
                 onClick={() => actualizarStock(producto.id, producto.stock + 1)}
                />
              </Flex>
            </Td>
              <Td  textAlign={"center"}>
                <Flex justifyContent={"center"} gap={2}>
                <Tooltip label={"Editar"}>
      <IconButton
        icon={<MdEdit />}
        aria-label="Editar"
        size="sm"
        color="blue.500"
        variant="ghost"
        onClick={() => handleEditarProducto(producto)} 
      />
    </Tooltip>
                  <Tooltip label={"Eliminar"}>  
                  <IconButton
  icon={<MdDelete />}
  onClick={() => {
    setSelectedProductId(producto.id);
    onOpen(); 
  }}
  aria-label="Eliminar"
  size="sm"
  color="red.500"
  variant="ghost"
/>
</Tooltip>
<Tooltip label={"Precios"}>  
<IconButton
                  icon={
                    filaExpandida === producto.id ? (
                      <MdExpandLess />
                    ) : (
                      <MdExpandMore />
                    )
                  }
                  aria-label="Expandir"
                  size="sm"
                  color="gray.600"
                  variant="ghost"
                  onClick={() => toggleExpandirFila(producto.id)}
                />
</Tooltip>

                </Flex>
              </Td>
            
            </Tr>
            {filaExpandida === producto.id && (
              <Tr>
                <Td colSpan={7} bg="gray.50">
                  <Flex justify="space-around" py={2} flexWrap="wrap">
                    <Text>
                      <strong>Valor Neto:</strong> ${producto.valorNeto}
                    </Text>
                    <Text>
                      <strong>Mayorista:</strong> ${producto.mayorista}
                    </Text>
                    <Text>
                      <strong>Minorista:</strong> ${producto.minorista}
                    </Text>
                  </Flex>
                </Td>
              </Tr>
            )}
          </Fragment>
        ))}
      </Tbody>
    </Table>
  </CardBody>
</Card>


        {/* Card de Accesorios */}
        <Card
   w={{ base: "100%", md: "100%", lg: "50%" }} 
    maxH="500px"
    bg="white"
    boxShadow="lg"
    borderRadius="md"
    overflow="hidden"
  >
          <CardHeader>
            <Text fontSize="20px" fontWeight="bold">
              Accesorios
            </Text>
          </CardHeader>
          <CardBody maxH="673px" overflowY="auto">
            <Table variant="simple">
              <Thead bg="gray.100">
                <Tr>
                  <Th  textAlign={"center"}>ID</Th>
                  <Th textAlign={"center"}>Nombre</Th>
                  <Th textAlign={"center"}>Stock</Th>
                  <Th textAlign={"center"}>Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {accesoriosFiltrados.map((accesorio: any) => (
                   <Fragment key={accesorio.id}>
                  <Tr key={accesorio.id}>
                    <Td  textAlign={"center"}>{accesorio.id}</Td>
                    <Td  textAlign={"center"}>{accesorio.nombre}</Td>
                    <Td  textAlign={"center"}>{accesorio.stock}</Td>
                    <Td  textAlign={"center"}>
                <Flex justifyContent={"center"} gap={2}>
                <Tooltip label={"Editar"}> 
                  <IconButton
                    icon={<MdEdit />}
                    aria-label="Editar"
                    size="sm"
                    color="blue.500"
                    variant="ghost"
                  />
                  </Tooltip>
                  <Tooltip label={"Eliminar"}>  
                  <IconButton
  icon={<MdDelete />}
  onClick={() => {
    setSelectedProductId(accesorio.id);
    onOpen(); 
  }}
  aria-label="Eliminar"
  size="sm"
  color="red.500"
  variant="ghost"
/>
</Tooltip>
<Tooltip label={"Precios"}>  
<IconButton
                  icon={
                    filaExpandida === accesorio.id ? (
                      <MdExpandLess />
                    ) : (
                      <MdExpandMore />
                    )
                  }
                  aria-label="Expandir"
                  size="sm"
                  color="gray.600"
                  variant="ghost"
                  onClick={() => toggleExpandirFila(accesorio.id)}
                />
</Tooltip>

                </Flex>
              </Td>
                  </Tr>
                   {filaExpandida === accesorio.id && (
                    <Tr>
                      <Td colSpan={7} bg="gray.50">
                        <Flex justify="space-around" py={2} flexWrap="wrap">
                          <Text>
                            <strong>Valor Neto:</strong> ${accesorio.valorNeto}
                          </Text>
                          <Text>
                            <strong>Mayorista:</strong> ${accesorio.mayorista}
                          </Text>
                          <Text>
                            <strong>Minorista:</strong> ${accesorio.minorista}
                          </Text>
                        </Flex>
                      </Td>
                    </Tr>
                  )}
                </Fragment>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </Flex>

      {isModalUpdateOpen && (
 <EditProduct
 isOpen={isModalUpdateOpen}
 onClose={() => {
  setIsModalUpdateOpen(false);
   setProductoSeleccionado(null);
 }}
 producto={productoSeleccionado}
 categorias={categorias}
 modelos={modelos}
 fetchProductos={fetchProductos}
 fetchModelos={fetchModelos}
/>
)}

{isModalOpen && (
        <NewProduct
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          categorias={categorias}
          productos={productos}
          modelos={modelos} 
          fetchProductos={fetchProductos}
          
        />
      )}


<Modal isOpen={isOpen} onClose={onClose} isCentered>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Confirmar eliminación</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      ¿Estás seguro que querés eliminar este producto?
    </ModalBody>

    <ModalFooter>
      <Button onClick={onClose} mr={3}>
        Cancelar
      </Button>
      <Button
        colorScheme="red"
        onClick={() => {
          handleDeleteConfirm(); 
          onClose(); 
        }}
      >
        Eliminar
      </Button>
    </ModalFooter>
  </ModalContent>
</Modal>

    </Box>
  );
}

export default Productos;
