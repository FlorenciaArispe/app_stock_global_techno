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
import { FaDollarSign } from "react-icons/fa";
import NewProduct from "./NewProduct";

function Productos({ productos, categorias, modelos , onDelete , fetchProductos }: any) {
  const [tipoCelulares, setTipoCelulares] = useState("nuevos");
  const [filaExpandida, setFilaExpandida] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProductId, setSelectedProductId] = useState(null);

  const celulares = productos.filter((producto: any) =>
    tipoCelulares === "nuevos"
      ? producto.categoria === 1
      : producto.categoria === 2
  );

  const accesoriosFiltrados = productos.filter(
    (producto: any) => producto.categoria === 3
  );

  console.log("modelos",modelos)

  const toggleExpandirFila = (id: number) => {
    setFilaExpandida(filaExpandida === id ? null : id);
  };

  

  const handleDeleteConfirm = () => {
    onDelete(selectedProductId)
  }

  // 🔍 Función para obtener el nombre del modelo
  const obtenerNombreModelo = (modeloId: number) => {
    console.log("modeloid",modeloId)
    const modelo = modelos.find((m: any) => m.id === modeloId);
    return modelo ? modelo.nombre : "null";
  };

  return (
    <Box>
      <Flex justify="left" mb={4}>
        <Button colorScheme="green" onClick={() => setIsModalOpen(true)}>
          Agregar Producto
        </Button>
      </Flex>

      <Flex gap={6} mb={6} justify="center" align="start" flexWrap="nowrap">
        {/* Card de Celulares */}
        <Card
  w="50%"
  minH={"500px"}
  maxH={"500px"}
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
         
          <Th>Modelo</Th>
          <Th>Color</Th>
          <Th>Capacidad</Th>
          <Th>Stock</Th>
          <Th textAlign="center">IMEI</Th>
          <Th>Acciones</Th>
        
   
        </Tr>
      </Thead>
      <Tbody>
        {celulares.map((producto: any) => (
          <Fragment key={producto.id}>
            <Tr>
              <Td  textAlign={"center"} isTruncated>{obtenerNombreModelo(producto.modeloId)}</Td>
              <Td  p={1} textAlign={"center"}>{producto.color}</Td>
              <Td  p={1} textAlign={"center"}>{producto.capacidad}</Td>
              <Td  p={1} textAlign={"center"}>{producto.stock}</Td>
             <Td p={1} textAlign={"center"}>{producto.imei}</Td>
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
          w="50%"
          minH={"500px"}
          maxH={"500px"}
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
                  <Th>ID</Th>
                  <Th>Nombre</Th>
                  <Th>Stock</Th>
                  <Th>Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {accesoriosFiltrados.map((accesorio: any) => (
                  <Tr key={accesorio.id}>
                    <Td>{accesorio.id}</Td>
                    <Td>{accesorio.nombre}</Td>
                    <Td>{accesorio.stock}</Td>
                    <Td>
                      <Flex gap={2}>
                        <IconButton
                          icon={<MdEdit />}
                          aria-label="Editar"
                          size="sm"
                          color="blue.500"
                          variant="ghost"
                        />
                        <IconButton
                          icon={<MdDelete />}
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
          </CardBody>
        </Card>
      </Flex>

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
