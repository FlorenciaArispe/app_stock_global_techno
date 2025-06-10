import { Fragment, useRef, useState } from "react";
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
  useBreakpointValue,
  Input,
  AlertDialogOverlay,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from "@chakra-ui/react";
import { MdDelete, MdEdit, MdExpandLess, MdExpandMore } from "react-icons/md";
import NewProduct from "./NewProduct";
import EditProduct from "./EditProduct";
import { AddIcon, MinusIcon, SearchIcon } from "@chakra-ui/icons";
import { deleteProducto, updateStockProducto } from "../supabase/productos.service";
import ModalConfirmacionDelete from "./ModalConfirmacionDelete";
import { CardMobileCelular } from "./CardMobileCelular";
import { CardMobileAccesorio } from "./CardMobileAccesorio";
import { Modelo, Producto } from "../types";
import { fetchProductos } from "../services/fetchData";
import RegistrarVentaEnProductos from "./RegistrarVentaEnProductos";

interface ProductosProps {
  productos: Producto[];
  modelos: Modelo[];
  onDelete: (id: number) => Promise<void>;
}

interface ProductoModificar {
  id: number;
  stockNuevo: number;
}

function Productos({ productos, modelos, onDelete }: ProductosProps) {
  const [tipoCelulares, setTipoCelulares] = useState("nuevos");
  const [filaExpandida, setFilaExpandida] = useState<number | null>(null);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isConfirmDialogOpen,
    onOpen: openConfirmDialog,
    onClose: closeConfirmDialog,
  } = useDisclosure();
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
  const { isOpen: isVentaOpen, onOpen: onVentaOpen, onClose: onVentaClose } = useDisclosure();
  const [productoModificar, setProductoModificar] = useState<ProductoModificar | null>(null);
  const [productoNewVenta, setProductoNewVenta] = useState<Producto | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const isMobile = useBreakpointValue(
    { base: true, xl: false },
    { fallback: "base" }
  );
  const isMobile2 = useBreakpointValue({ base: true, sm: false }, { fallback: "base" });
  const cancelRef = useRef(null);
  const [productoAEliminar, setProductoAEliminar] = useState<Producto | null>(null);
  const [accesorioAEliminar, setAccesorioAEliminar] = useState<Producto | null>(null);
  const [mostrarBuscadorMobile, setMostrarBuscadorMobile] = useState(false);
  const [mostrarBuscadorAccesoriosMobile, setMostrarBuscadorAccesoriosMobile] = useState(false);
  const [busquedaCelulares, setBusquedaCelulares] = useState("");
  const [busquedaAccesorios, setBusquedaAccesorios] = useState("");
  const obtenerNombreModelo = (modeloId: number) => {
    const modelo = modelos.find((m: any) => m.id === modeloId);
    return modelo ? modelo.nombre : "null";
  };

  const celulares = productos.filter((producto: any) => {
    const coincideCategoria =
      tipoCelulares === "nuevos"
        ? producto.categoria === 1
        : producto.categoria === 2;

    const nombreModelo = obtenerNombreModelo(producto.modeloId)?.toLowerCase() || "";

    const coincideBusqueda = nombreModelo.includes(busquedaCelulares.toLowerCase());

    return coincideCategoria && coincideBusqueda;
  });

  const accesoriosFiltrados = productos.filter(
    (producto: any) =>
      producto.categoria === 3 &&
      producto.nombre?.toLowerCase().includes(busquedaAccesorios.toLowerCase())
  );

  const toggleExpandirFila = (id: number) => {
    setFilaExpandida(filaExpandida === id ? null : id);
  };

  const handleDeleteConfirm = () => {
    if (selectedProductId !== null) {
      onDelete(selectedProductId);
    }
  }

  function handleEditarProducto(producto: any) {
    setProductoSeleccionado(producto);
    setIsModalUpdateOpen(true);
  }

  const handleDelete = async (id: number) => {
    await deleteProducto(id);
    await fetchProductos();
    closeConfirmDialog()
  }

  const aumentarStock = async (producto: Producto, stockNuevo: number) => {
    await updateStockProducto(producto.id, stockNuevo);
  }

  const disminuirStock = async (producto: Producto, stockNuevo: number) => {
    const id = producto.id;
    setProductoModificar({ id, stockNuevo });
    setProductoNewVenta(producto)
    if (producto.categoria == 3) {
      setProductoAEliminar(null)
      setAccesorioAEliminar(producto)
    } else {
      setAccesorioAEliminar(null)
      setProductoAEliminar(producto)
    }
    onConfirmOpen();
  };

  const confirmarActualizarStock = async () => {
    if (!productoModificar) return;
    const { id, stockNuevo } = productoModificar;
    if (stockNuevo <= 0) {
      openConfirmDialog()
    } else {
      await updateStockProducto(id, stockNuevo);
      await fetchProductos();
    }
    setProductoModificar(null);
    onConfirmClose();
  };

  const manejarRegistrarVenta = () => {
    onConfirmClose();
    onVentaOpen();
  };

  

  return (
    <Box p={{ base: 0, md: 5 }} bg={"gray.100"}
    >
      <Flex mb={5}>
        <Button
          w={{ base: "100%", md: "190px" }}
          p={2}
          colorScheme="green"
          size={{ base: "sm", md: "md" }}
          leftIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
        >
          <Box>Agregar Equipo</Box>
        </Button>
      </Flex>
      <Flex
        gap={6}
        justify="center"
        align="start"
        flexDirection={{ base: "column", md: "column", lg: "column", xl: "row" }}
      >

        {!isMobile ? (
          <Card
            w={{ base: "100%", md: "100%", lg: "100%", xl: "row" }}
            bg="white"
            boxShadow="lg"
            borderRadius="md"
          >
            <CardHeader>
              <Flex justify="space-between" align="center">
                <Text fontSize="20px" fontWeight="bold">
                  iPhones {tipoCelulares === "nuevos" ? "Sellados" : "Usados"}
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
            <CardBody overflowX="hidden">
              <Table variant="simple" width="100%">
                <Thead bg="gray.100">
                  <Tr>
                    <Th textAlign={"center"}>Modelo</Th>
                    <Th textAlign={"center"}>Color</Th>
                    <Th textAlign={"center"}>Capacidad</Th>
                    <Th textAlign={"center"}>Stock</Th>
                    <Th textAlign={"center"}>Acciones</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {celulares.map((producto: any) => (
                    <Fragment key={producto.id}>
                      <Tr>
                        <Td textAlign={"center"} isTruncated>{obtenerNombreModelo(producto.modeloId)}</Td>
                        <Td p={1} textAlign={"center"}>{producto.color}</Td>
                        <Td p={1} textAlign={"center"}>{producto.capacidad}</Td>
                        <Td textAlign="center">
                          <Flex justifyContent="center" alignItems="center" gap={2}>
                            <IconButton
                              icon={<MinusIcon />}
                              aria-label="Disminuir stock"
                              size="sm"
                              onClick={() => disminuirStock(producto, producto.stock - 1)}
                            />
                            <Text minW="20px" textAlign="center">{producto.stock}</Text>
                            <IconButton
                              icon={<AddIcon />}
                              aria-label="Aumentar stock"
                              size="sm"
                              onClick={() => aumentarStock(producto, producto.stock + 1)}
                            />
                          </Flex>
                        </Td>
                        <Td textAlign={"center"}>
                          <Flex justifyContent={"center"} gap={2}>                       
                              <IconButton
                                icon={<MdEdit />}
                                aria-label="Editar"
                                size="sm"
                                color="blue.500"
                                variant="ghost"
                                onClick={() => handleEditarProducto(producto)}
                              />                           
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
                          </Flex>
                        </Td>
                      </Tr>
                      {filaExpandida === producto.id && (
                        <Tr>
                          <Td colSpan={7} bg="gray.50">
                            <Flex justify="space-around" py={2} flexWrap="wrap">
                              <Text>
                                <strong>Mayorista:</strong> ${producto.mayorista}
                              </Text>
                              <Text>
                                <strong>Minorista:</strong> ${producto.minorista}
                              </Text>
                              {/* {producto.valorNeto !== 0 && (
                                <Text><strong>Valor Neto:</strong>${producto.valorNeto}</Text>
                              )} */}
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
        ) : (
          <Box w={"100%"}>
            <Flex justify="space-between" align="center" mb={3} wrap="wrap">
              <Flex direction="row" align="center" gap={2}>
                <Text fontSize={{ base: "18", md: "20px" }} fontWeight="bold">
                  iPhones {tipoCelulares === "nuevos" ? "Sellados" : "Usados"}
                </Text>

                {!isMobile2 && (
                  <Input
                    borderRadius="7px"
                    placeholder="Buscar modelo"
                    size="sm"
                    w="160px"
                    bg="white"
                    value={busquedaCelulares}
                    onChange={(e) => setBusquedaCelulares(e.target.value)}
                  />
                )}

                {isMobile2 && (
                  <IconButton
                    icon={<SearchIcon />}
                    aria-label="Buscar"
                    size="xs"
                    onClick={() => setMostrarBuscadorMobile((prev) => !prev)}
                  />
                )}
              </Flex>
              <ButtonGroup isAttached size={{ base: "xs", md: "sm" }} mt={{ base: 2, sm: 0 }}>
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

            {isMobile2 && mostrarBuscadorMobile && (
              <Input
                mb={2}
                borderRadius="7px"
                placeholder="Buscar modelo"
                size="sm"
                w="100%"
                bg="white"
                value={busquedaCelulares}
                onChange={(e) => setBusquedaCelulares(e.target.value)}
              />
            )}

            {celulares.map((producto: any) => (
              <CardMobileCelular
                key={producto.id}
                producto={producto}
                onEditar={() => handleEditarProducto(producto)}
                onEliminar={() => {
                  setSelectedProductId(producto.id);
                  onOpen();
                }}
                onExpandir={() => toggleExpandirFila(producto.id)}
                expandido={filaExpandida === producto.id}
                disminuirStock={disminuirStock}
                aumentarStock={aumentarStock}
              />
            ))}
          </Box>
        )}

        {!isMobile ? (
          <Card
            w={{ base: "100%", md: "100%", lg: "100%", xl: "row" }}
            bg="white"
            boxShadow="lg"
            borderRadius="md"
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
                    <Th textAlign={"center"}>Nombre</Th>
                    <Th textAlign={"center"}>Stock</Th>
                    <Th textAlign={"center"}>Acciones</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {accesoriosFiltrados.map((accesorio: any) => (
                    <Fragment key={accesorio.id}>
                      <Tr key={accesorio.id}>
                        <Td textAlign={"center"}>{accesorio.nombre}</Td>
                        <Td textAlign="center">
                          <Flex justifyContent="center" alignItems="center" gap={2}>
                            <IconButton
                              icon={<MinusIcon />}
                              aria-label="Disminuir stock"
                              size="sm"
                              onClick={() => disminuirStock(accesorio, accesorio.stock - 1)}
                              isDisabled={accesorio.stock <= 0}
                            />
                            {accesorio.stock}
                            <IconButton
                              icon={<AddIcon />}
                              aria-label="Aumentar stock"
                              size="sm"
                              onClick={() => aumentarStock(accesorio, accesorio.stock + 1)}
                            />
                          </Flex>
                        </Td>
                        <Td textAlign={"center"}>
                          <Flex justifyContent={"center"} gap={2}>
                              <IconButton
                                icon={<MdEdit />}
                                aria-label="Editar"
                                size="sm"
                                color="blue.500"
                                variant="ghost"
                                onClick={() => handleEditarProducto(accesorio)}
                              />
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
                          </Flex>
                        </Td>
                      </Tr>
                      {filaExpandida === accesorio.id && (
                        <Tr>
                          <Td colSpan={7} bg="gray.50">
                            <Flex justify="space-around" py={2} flexWrap="wrap">
                              <Text>
                                <strong>Mayorista:</strong> ${accesorio.mayorista}
                              </Text>
                              <Text>
                                <strong>Minorista:</strong> ${accesorio.minorista}
                              </Text>
                              {/* {accesorio.valorNeto !== 0 && (
                                <Text><strong>Valor Neto:</strong>${accesorio.valorNeto}</Text>
                              )} */}
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
        ) : (
          <Box w={"100%"} >
            <Flex direction={
              isMobile && mostrarBuscadorAccesoriosMobile ? "column" : "row"
            } gap={2} mb={2}>
              <Flex justify="flex-start" align="center">
                <Text fontSize={{ base: "18", md: "20px" }} fontWeight="bold">
                  Accesorios
                </Text>
                {isMobile2 && (
                  <IconButton
                    icon={<SearchIcon />}
                    aria-label="Buscar accesorio"
                    size="sm"
                    onClick={() =>
                      setMostrarBuscadorAccesoriosMobile((prev) => !prev)
                    }
                  />
                )}
              </Flex>
              {(!isMobile2 || mostrarBuscadorAccesoriosMobile) && (
                <Input
                  borderRadius="7px"
                  size="sm"
                  w={{ base: "100%", sm: "160px" }}
                  bg="white"
                  placeholder="Buscar accesorio"
                  value={busquedaAccesorios}
                  onChange={(e) => setBusquedaAccesorios(e.target.value)}
                />
              )}
            </Flex>
            {accesoriosFiltrados.map((accesorio: any) => (
              <CardMobileAccesorio
                key={accesorio.id}
                accesorio={accesorio}
                onEditar={() => handleEditarProducto(accesorio)}
                onEliminar={() => {
                  setSelectedProductId(accesorio.id);
                  onOpen();
                }}
                onExpandir={() => toggleExpandirFila(accesorio.id)}
                expandido={filaExpandida === accesorio.id}
                disminuirStock={disminuirStock}
                aumentarStock={aumentarStock}
              />
            ))}
          </Box>
        )}
      </Flex>

      {isVentaOpen && productoNewVenta && (
        <RegistrarVentaEnProductos
          isOpen={isVentaOpen}
          onClose={onVentaClose}
          stockNuevo={productoModificar?.stockNuevo}
          productoNewVenta={productoNewVenta}
          modelos={modelos}
        />
      )}

      {isModalUpdateOpen && (
        <EditProduct
          isOpen={isModalUpdateOpen}
          onClose={() => {
            setIsModalUpdateOpen(false);
            setProductoSeleccionado(null);
          }}
          producto={productoSeleccionado}
          modelos={modelos}
          productos={productos}
          fetchProductos={fetchProductos}
        />
      )}

      {isModalOpen && (
        <NewProduct
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productos={productos}
          modelos={modelos}
        />
      )}

      <ModalConfirmacionDelete isOpen={isOpen} onClose={onClose} handleDeleteConfirm={handleDeleteConfirm} />

      {(productoAEliminar || accesorioAEliminar) && (
        <AlertDialog
          isOpen={isConfirmDialogOpen}
          leastDestructiveRef={cancelRef}
          onClose={closeConfirmDialog}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                {productoAEliminar ? `${obtenerNombreModelo(productoAEliminar.modeloId)} ${productoAEliminar.capacidad} ${productoAEliminar.color}` :
                  accesorioAEliminar?.nombre
                }
              </AlertDialogHeader>
              <AlertDialogBody>
                ¿Estás seguro de que ya no hay stock de este producto?
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={closeConfirmDialog}>
                  Cancelar
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    const id = productoAEliminar ? productoAEliminar.id : accesorioAEliminar?.id;
                    if (id !== undefined) {
                      handleDelete(id);
                    }
                  }}
                  ml={3}
                >
                  Aceptar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}

      {isConfirmOpen && (
        <Modal isOpen={isConfirmOpen} onClose={onConfirmClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader> Si no registras la venta el producto no aparecerá después</ModalHeader>

            <ModalFooter >
              <Flex direction={"row"} justifyContent={"center"} w={"100%"}>
                <Button colorScheme="green" mr={3} onClick={manejarRegistrarVenta}>
                  Ir a registrar la venta
                </Button>
                <Button variant="ghost" onClick={confirmarActualizarStock}>
                  Solo actualizar stock
                </Button>
              </Flex>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

    </Box>
  );
}

export default Productos;