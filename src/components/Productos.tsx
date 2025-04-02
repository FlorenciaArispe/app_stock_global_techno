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

const celularesNuevos = [
  { id: 1, modelo: "14 Pro", capacidad: "256GB", stock: 10, color: "Negro", valorNeto: 800, mayorista: 950, minorista: 1100 },
  { id: 2, modelo: "13", capacidad: "512GB", stock: 5, color: "Verde", valorNeto: 700, mayorista: 850, minorista: 1000 },
];

const celularesUsados = [
  { id: 3, modelo: "12", capacidad: "128GB", stock: 4, color: "Azul", valorNeto: 500, mayorista: 650, minorista: 800 },
  { id: 4, modelo: "15 Pro", capacidad: "256GB", stock: 6, color: "Negro", valorNeto: 900, mayorista: 1050, minorista: 1200 },
];;

const accesorios = [
  { id: 1, nombre: "Cargador Rápido", stock: 20 },
  { id: 2, nombre: "Funda iPhone 14", stock: 15 },
];

function Productos() {
  const [tipoCelulares, setTipoCelulares] = useState("nuevos");
  const [filaExpandida, setFilaExpandida] = useState<number | null>(null);

  const celulares = tipoCelulares === "nuevos" ? celularesNuevos : celularesUsados;

  const toggleExpandirFila = (id: number) => {
    setFilaExpandida(filaExpandida === id ? null : id);
  };


  return (
    <Box p={6}>
      <Flex gap={6} mb={6} justify="center" align="start" flexWrap="nowrap">
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
          <CardBody>
            <Table variant="simple">
              <Thead bg="gray.100">
                <Tr>
                  <Th>ID</Th>
                  <Th>Modelo</Th>
                  <Th>Color</Th>
                  <Th>Capacidad</Th>
                  <Th>Stock</Th>
                  <Th>Acciones</Th>
                      <Th textAlign="center"><FaDollarSign /></Th>
                </Tr>
              </Thead>
              <Tbody>
                {celulares.map((producto) => (
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
                          <IconButton
                            icon={filaExpandida === producto.id ? <MdExpandLess /> : <MdExpandMore />}
                            aria-label="Expandir"
                            size="sm"
                            color="gray.600"
                            variant="ghost"
                            onClick={() => toggleExpandirFila(producto.id)}
                          />
                        </Flex>
                      </Td>
                    </Tr>
                    {filaExpandida === producto.id && (
                      <Tr>
                        <Td colSpan={6} bg="gray.50">
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
          <CardBody>
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
                {accesorios.map((accesorio) => (
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
    </Box>
  );
}

export default Productos;
