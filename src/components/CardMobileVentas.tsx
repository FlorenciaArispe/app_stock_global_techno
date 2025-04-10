import { Box, Text, Flex, Button, Divider, IconButton } from "@chakra-ui/react";
import { MdDelete, MdEdit } from "react-icons/md";

export const CardMobileVentas = ({ venta , editarVenta}: any) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="xl"
      p={4}
      mb={4}
      boxShadow="md"
      bg="white"
    >
      <Flex justifyContent="space-between" mb={1}>
        <Text fontWeight="bold" fontSize="md">
          {new Date(venta.fecha_venta).toLocaleDateString("es-AR")}
        </Text>
        <Text fontWeight="bold" color="green.500" fontSize="md">
          ${venta.total}
        </Text>
      </Flex>

      <Divider my={2} />

      <Flex
        direction={{ base: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ base: "flex-start", md: "center" }}
      >
        {/* Cliente */}
        <Box flex={1}>
          <Text fontSize="sm" color="gray.500" mb={1}>
            Cliente:
          </Text>
          <Text fontSize="md" fontWeight="medium">
            {venta.cliente || "Sin registro"}
          </Text>
        </Box>

        {/* Divider solo en mobile */}
        <Divider
          display={{ base: "block", md: "none" }}
          my={1}
        />

        {/* Productos */}
        <Box flex={2}>
          <Text fontSize="sm" color="gray.500" mb={1}>
            Productos:
          </Text>
          {venta.productos.map((p, i) => (
            <Box key={i} mb={2}>
              <Text fontSize="md">
                {`${p.nombre} x ${p.cantidad} ($${p.subtotal})`}
              </Text>
              {p.imei && (
                <Text fontSize="sm" color="gray.500" ml={2}>
                  IMEI: {p.imei}
                </Text>
              )}
            </Box>
          ))}
        </Box>
      </Flex>



      <Flex justifyContent="flex-end" gap={2}>
     
                                   <IconButton
                                     icon={<MdEdit />}
                                     aria-label="Editar"
                                     size="sm"
                                     color="blue.500"
                                     variant="ghost"
                                     onClick={() => editarVenta(venta)}
                                   />
                                   <IconButton
                                     icon={<MdDelete />}
                                     onClick={() => editarVenta(venta)}
                                     aria-label="Eliminar"
                                     size="sm"
                                     color="red.500"
                                     variant="ghost"
                                   />
                              
      </Flex>
    </Box>
  );
};
