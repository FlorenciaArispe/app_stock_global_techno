import { useState } from "react";
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
} from "@chakra-ui/react";
import { MdDelete, MdEdit, MdExpandLess, MdExpandMore } from "react-icons/md";
import { FaDollarSign } from "react-icons/fa";
import NewProduct from "./NewProduct";



function Productos({celularesNuevos, celularesUsados, accesorios , categorias}: any) {
  const [tipoCelulares, setTipoCelulares] = useState("nuevos");
  const [filaExpandida, setFilaExpandida] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const celulares = tipoCelulares === "nuevos" ? celularesNuevos : celularesUsados;

  const toggleExpandirFila = (id: number) => {
    setFilaExpandida(filaExpandida === id ? null : id);
  };


  return (
    <Box >
        <Flex justify="left" mb={4}>
        <Button colorScheme="green" onClick={() => setIsModalOpen(true)}>
          Agregar Producto
        </Button>
      </Flex>
      <Flex gap={6} mb={6} justify="center" align="start" flexWrap="nowrap">
        {/* Card de Celulares */}
        {/* Card de Celulares */}
<Card w="50%" minW="400px" bg="white" boxShadow="lg" borderRadius="md" overflow="hidden">
  <CardHeader>
    <Flex justify="space-between" align="center">
      <Text fontSize="20px" fontWeight="bold">
        Celulares {tipoCelulares === "nuevos" ? "Nuevos" : "Usados"}
      </Text>
      <ButtonGroup isAttached size="sm">
        <Button colorScheme={tipoCelulares === "nuevos" ? "blue" : "gray"} onClick={() => setTipoCelulares("nuevos")}>
          Nuevos
        </Button>
        <Button colorScheme={tipoCelulares === "usados" ? "blue" : "gray"} onClick={() => setTipoCelulares("usados")}>
          Usados
        </Button>
      </ButtonGroup>
    </Flex>
  </CardHeader>
  <CardBody maxH="673px" overflowY="auto">
    <Table variant="simple">
    <Thead bg="gray.100">
  <Tr>
    <Th>ID</Th>
    <Th>Modelo</Th>
    <Th>Color</Th>
    <Th>Capacidad</Th>
    <Th>Stock</Th>
    <Th>Acciones</Th>
    <Th display="flex" justifyContent="center"><FaDollarSign /></Th> {/* Última columna */}
  </Tr>
</Thead>
<Tbody>
  {celulares.map((producto : any) => (
    <>
      <Tr key={producto.id}>
        <Td>{producto.id}</Td>
        <Td>{producto.modelo}</Td>
        <Td>{producto.color}</Td>
        <Td>{producto.capacidad}</Td>
        <Td>{producto.stock}</Td>
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
        {/* Mueve el IconButton de expansión a la última celda */}
        <Td display="flex" justifyContent="center"> 
          <IconButton
            icon={filaExpandida === producto.id ? <MdExpandLess /> : <MdExpandMore />}
            aria-label="Expandir"
            size="sm"
            color="gray.600"
            variant="ghost"
            onClick={() => toggleExpandirFila(producto.id)}
          />
        </Td>
      </Tr>
      {filaExpandida === producto.id && (
        <Tr>
          <Td colSpan={7} bg="gray.50"> {/* Ajusta colSpan para cubrir todas las columnas */}
            <Flex justify="space-around" py={2}>
              <Text><strong>Valor Neto:</strong> ${producto.valorNeto}</Text>
              <Text><strong>Mayorista:</strong> ${producto.mayorista}</Text>
              <Text><strong>Minorista:</strong> ${producto.minorista}</Text>
            </Flex>
          </Td>
        </Tr>
      )}
    </>
  ))}
</Tbody>

    </Table>
  </CardBody>
</Card>

        
        {/* Card de Accesorios */}
        <Card w="50%" minW="400px" bg="white" boxShadow="lg" borderRadius="md" overflow="hidden">
  <CardHeader>
    <Text fontSize="20px" fontWeight="bold">Accesorios</Text>
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
        {accesorios.map((accesorio : any) => (
          <Tr key={accesorio.id}>
            <Td>{accesorio.id}</Td>
            <Td>{accesorio.nombre}</Td>
            <Td>{accesorio.stock}</Td>
            <Td>
              <Flex gap={2}>
                <IconButton icon={<MdEdit />} aria-label="Editar" size="sm" color="blue.500" variant="ghost" />
                <IconButton icon={<MdDelete />} aria-label="Eliminar" size="sm" color="red.500" variant="ghost" />
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
      />
      )}
     
    </Box>
  );
}

export default Productos;
