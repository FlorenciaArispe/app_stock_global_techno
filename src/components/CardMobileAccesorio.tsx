import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Text } from "@chakra-ui/react";
import { MdDelete, MdEdit, MdExpandLess, MdExpandMore } from "react-icons/md";

export const CardMobileAccesorio = ({ accesorio, onEditar, onEliminar, onExpandir, expandido, disminuirStock , aumentarStock }: any) => {
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
      <Flex direction={"row"} justifyContent={"space-between"}>
        <Flex direction={{ base: "column", md: "row" }} justifyContent={"space-between"} w={{ base: "auto", md: "90%" }}>
          <Flex>
            <IconButton
              mr={2}
              icon={expandido ? <MdExpandLess /> : <MdExpandMore />}
              aria-label="Expandir"
              size="xs"
              color="gray.600"
              variant="ghost"
              onClick={onExpandir}
            />
            <Text fontWeight={500}>{accesorio.nombre}</Text>
          </Flex>
          <Flex justifyContent="space-between" alignItems="center" w={"80px"} mt={{ base: 1, md: 0 }} ml={{ base: 8, md: 0 }} mr={4}>
            <IconButton
              icon={<MinusIcon />}
              aria-label="Disminuir stock"
              size="xs"
              onClick={() => disminuirStock(accesorio, accesorio.stock - 1)}
            />
            {accesorio.stock}
            <IconButton
              icon={<AddIcon />}
              aria-label="Aumentar stock"
              size="xs"
              onClick={() => aumentarStock(accesorio, accesorio.stock + 1)}
            />
          </Flex>
        </Flex>
        <Flex>
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
      {expandido && (
        <Flex mt={1} p={2} borderRadius="md" flexDirection={{ base: "column", md: "row" }} gap={1}>
        <Text><strong>Mayorista:</strong> ${accesorio.mayorista} <strong> Minorista:</strong> ${accesorio.minorista}</Text>
        {/* {accesorio.valorNeto !== 0 && (
          <Text><strong>Valor Neto:</strong>${accesorio.valorNeto}</Text>
        )} */}
          
        </Flex>
      )}
    </Box>
  );
};
