import { Box, Text, Flex, Divider, IconButton } from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";

type ProductoVenta = {
  nombre: string;
  cantidad: number;
  subtotal: number;
  imei?: string;
  descripcion?: string;
};

export const CardMobileVentas = ({ venta, onOpen, setSelectedVentaId }: any) => {

  const productos: ProductoVenta[] = typeof venta.productos === "string"
  ? JSON.parse(venta.productos)
  : venta.productos;

  return (
    <Box
      borderWidth="1px"
      borderRadius="xl"
      p={3}
      mb={4}
      boxShadow="md"
      bg="white"
      borderLeft="5px solid #F6AD55"
    >
      <Flex justifyContent="space-between" mb={1}>
        <Flex>
          <Text mr={4} fontWeight="bold" fontSize="md">
            {venta.fecha_venta}
          </Text>
          <Flex alignContent={"center"}>
            <Text mr={2} fontSize="md" color="gray.500">
              Cliente:
            </Text>
            <Text fontSize="md" fontWeight="medium">
              {venta.cliente || "Sin registro"}
            </Text>
          </Flex>
        </Flex>
        <Flex justifyContent="flex-end" gap={2}>
          <IconButton
            icon={<MdDelete />}
            onClick={() => {
              setSelectedVentaId(venta.id);
              onOpen();
            }}
            aria-label="Eliminar"
            size="sm"
            color="red.500"
            variant="ghost"
          />
        </Flex>
      </Flex>
      <Divider
        display={{ base: "block", md: "none" }}
        my={1}
      />
      <Box>
        <Text fontSize="sm" color="gray.500" mb={1}>
          Productos:
        </Text>
        <Flex
          direction={"row"}
          flexWrap="wrap"
          gap={4}
        >
        {Array.isArray(productos) &&
  productos.map((p, i) => (
    <Box key={i} mb={{ base: 2, md: 0 }}>
      <Text>{`${p.nombre} ${p.descripcion ?? ""} x ${p.cantidad} ($${p.subtotal})`}</Text>
      {p.imei && (
        <Text fontSize="sm" color="gray.500" ml={2}>
          IMEI: {p.imei}
        </Text>
      )}
    </Box>
))}
        </Flex>
      </Box>
      <Text textAlign={"right"} fontWeight="bold" color="green.500" fontSize="md">
        ${venta.total}
      </Text>
    </Box>
  );
};
