import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  Input,
  Text,
} from "@chakra-ui/react";
import { MdDelete, MdEdit } from "react-icons/md";

export const CardMobileCelular = ({
  producto,
  onEditar,
  onEliminar,
  disminuirStock,
  aumentarStock,
}: any) => {
  return (
    <Box
      w="100%"
      p={3}
      mb={4}
      borderRadius="md"
      boxShadow="sm"
      bg="white"
      borderLeft="5px solid #F6AD55"
    >
      {/* Encabezado: modelo + botones */}
      <Flex justify="space-between" align="center" mb={2}>
        <Text fontWeight="bold" fontSize="md">
          {producto.modelo} {producto.capacidad} - {producto.color}
        </Text>
        <Flex gap={2}>
          <IconButton
            icon={<MdEdit />}
            aria-label="Editar"
            size="sm"
            color="blue.500"
            variant="ghost"
            onClick={onEditar}
          />
          <IconButton
            icon={<MdDelete />}
            aria-label="Eliminar"
            size="sm"
            color="red.500"
            variant="ghost"
            onClick={onEliminar}
          />
        </Flex>
      </Flex>

      {/* Stock */}
      <Flex align="center" gap={2} mb={2}>
        <Text>Stock:</Text>
        <IconButton
          icon={<MinusIcon />}
          aria-label="Disminuir stock"
          size="xs"
          onClick={() => disminuirStock(producto, producto.stock - 1)}
        />
        <Text minW="20px" fontSize="md" textAlign="center">
          {producto.stock}
        </Text>
        <IconButton
          icon={<AddIcon />}
          aria-label="Aumentar stock"
          size="xs"
          onClick={() => aumentarStock(producto, producto.stock + 1)}
        />
      </Flex>

      {/* Precios */}
      <Flex direction="row" align="center" gap={2}>
        <Text>Minorista:</Text>
        <Input
          value={producto.minorista}
          size="sm"
          width="80px"
          // onChange={(e) => handlePrecioChange(producto.id, "minorista", e.target.value)}
        />
        <Text>Mayorista:</Text>
        <Input
          value={producto.mayorista}
          size="sm"
          width="80px"
          // onChange={(e) => handlePrecioChange(producto.id, "mayorista", e.target.value)}
        />
      </Flex>
    </Box>
  );
};
