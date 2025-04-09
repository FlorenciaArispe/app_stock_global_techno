import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Text, Tooltip } from "@chakra-ui/react";
import { MdDelete, MdEdit, MdExpandLess, MdExpandMore } from "react-icons/md";

export const CardMobileAccesorio = ({ accesorio, onEditar, onEliminar, onExpandir, expandido ,actualizarStock} : any) => {
    return (
      <Box
      w={"100%"}
        p={2}
        mb={2}
        borderRadius="md"
        boxShadow="md"
        bg="white"
        borderLeft="5px solid #F6AD55"
      >
        <Flex direction="column" gap={1}>
          <Text fontWeight={500}>{accesorio.nombre}</Text>
        </Flex>
     
  
        <Flex justify="space-between" mt={3} gap={2}>
        <Flex justifyContent="center" alignItems="center" gap={2}>
                      <IconButton
                        icon={<MinusIcon />}
                        aria-label="Disminuir stock"
                        size="sm"
                        onClick={() => actualizarStock(accesorio.id, accesorio.stock - 1)}
                        isDisabled={accesorio.stock <= 0}
                      />
                      {accesorio.stock}
                      <IconButton
                        icon={<AddIcon />}
                        aria-label="Aumentar stock"
                        size="sm"
                        onClick={() => actualizarStock(accesorio.id, accesorio.stock + 1)}
                      />
                    </Flex>
                    <Box>
          <Tooltip label="Editar">
            <IconButton
              icon={<MdEdit />}
              aria-label="Editar"
              size="sm"
              color="blue.500"
              variant="ghost"
              onClick={onEditar}
            />
          </Tooltip>
          <Tooltip label="Eliminar">
            <IconButton
              icon={<MdDelete />}
              aria-label="Eliminar"
              size="sm"
              color="red.500"
              variant="ghost"
              onClick={onEliminar}
            />
          </Tooltip>
          <Tooltip label="Precios">
            <IconButton
              icon={expandido ? <MdExpandLess /> : <MdExpandMore />}
              aria-label="Expandir"
              size="sm"
              color="gray.600"
              variant="ghost"
              onClick={onExpandir}
            />
          </Tooltip>
          </Box>
        </Flex>
  
        {expandido && (
          <Box mt={2} bg="gray.50" p={2} borderRadius="md">
            <Text><strong>Mayorista:</strong> ${accesorio.mayorista} <strong> Minorista:</strong> ${accesorio.minorista}</Text>
            <Text><strong>Valor Neto:</strong> ${accesorio.valorNeto}</Text>
          </Box>
        )}
      </Box>
    );
  };
  