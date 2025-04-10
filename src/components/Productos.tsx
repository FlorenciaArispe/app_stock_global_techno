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
  Tooltip,
  useBreakpointValue,
  Input,
  AlertDialogOverlay,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { MdDelete, MdEdit, MdExpandLess, MdExpandMore } from "react-icons/md";
import NewProduct from "./NewProduct";
import EditProduct from "./EditProduct";
import { AddIcon, MinusIcon, SearchIcon } from "@chakra-ui/icons";
import { deleteProducto, updateStockProducto } from "../supabase/productos.service";
import ModalConfirmacionDelete from "./ModalConfirmacionDelete";
import { CardMobileCelular } from "./CardMobileCelular";
import { CardMobileAccesorio } from "./CardMobileAccesorio";

function Productos({ productos, categorias, modelos, onDelete, fetchProductos, fetchModelos }: any) {
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
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const isMobile = useBreakpointValue(
    { base: true, xl: false },
    { fallback: "base" }
  );
  const isMobile2 = useBreakpointValue({ base: true, sm: false }, { fallback: "base" });

  const cancelRef = useRef(null);
  const [productoAEliminar, setProductoAEliminar] = useState<any>(null);
  const [accesorioAEliminar, setAccesorioAEliminar] = useState<any>(null);


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
    onDelete(selectedProductId)
  }


  function handleEditarProducto(producto: any) {
    console.log("producto seleccionado", producto)
    setProductoSeleccionado(producto);
    setIsModalUpdateOpen(true);
  }

  const actualizarStock = async (id, stockNuevo) => {
    if (stockNuevo <= 0) {
      await deleteProducto(id);
    } else {
      await updateStockProducto(id, stockNuevo);
    }
    fetchProductos();
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
          <Box>Agregar Producto</Box>
        </Button>
      </Flex>
      <Flex
        gap={6}
        justify="center"
        align="start"
        flexDirection={{ base: "column", md: "column", lg: "column", xl: "row" }}
      >
        {/* Card de Celulares */}
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
                              onClick={() => {
                                if (producto.stock === 1) {
                                  setProductoAEliminar(producto); 
                                  openConfirmDialog(); 
                                } else {
                                  actualizarStock(producto.id, producto.stock - 1);
                                }
                              }}
                            />
                            <Text minW="20px" textAlign="center">{producto.stock}</Text>
                            <IconButton
                              icon={<AddIcon />}
                              aria-label="Aumentar stock"
                              size="sm"
                              onClick={() => actualizarStock(producto.id, producto.stock + 1)}
                            />
                          </Flex>

                        </Td>
                        <Td textAlign={"center"}>
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
        ) : (
          <Box w={"100%"}>
            <Flex justify="space-between" align="center" mb={3} wrap="wrap">
              <Flex direction="row" align="center" gap={2}>
                <Text fontSize={{base:"18", md:"20px"}} fontWeight="bold">
                  Celulares {tipoCelulares === "nuevos" ? "Nuevos" : "Usados"}
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
              <ButtonGroup isAttached size={{base: "xs", md:"sm"}} mt={{ base: 2, sm: 0 }}>
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
                producto={{
                  ...producto,
                  modelo: obtenerNombreModelo(producto.modeloId),
                }}
                onEditar={() => handleEditarProducto(producto)}
                onEliminar={() => {
                  setSelectedProductId(producto.id);
                  onOpen();
                }}
                onExpandir={() => toggleExpandirFila(producto.id)}
                expandido={filaExpandida === producto.id}
                actualizarStock={actualizarStock}
                setProductoAEliminar={setProductoAEliminar}
                openConfirmDialog={openConfirmDialog}
              />
            ))}
          </Box>
        )}

        {/* Card de Accesorios */}
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
                    <Th textAlign={"center"}>ID</Th>
                    <Th textAlign={"center"}>Nombre</Th>
                    <Th textAlign={"center"}>Stock</Th>
                    <Th textAlign={"center"}>Acciones</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {accesoriosFiltrados.map((accesorio: any) => (
                    <Fragment key={accesorio.id}>
                      <Tr key={accesorio.id}>
                        <Td textAlign={"center"}>{accesorio.id}</Td>
                        <Td textAlign={"center"}>{accesorio.nombre}</Td>
                        <Td textAlign="center">
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
                        </Td>
                        <Td textAlign={"center"}>
                          <Flex justifyContent={"center"} gap={2}>
                            <Tooltip label={"Editar"}>
                              <IconButton
                                icon={<MdEdit />}
                                aria-label="Editar"
                                size="sm"
                                color="blue.500"
                                variant="ghost"
                                onClick={() => handleEditarProducto(accesorio)}
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
        ) : (
          <Box w={"100%"} >
            <Flex direction={
              isMobile && mostrarBuscadorAccesoriosMobile ? "column" : "row"
            } gap={2} mb={2}>
              {/* Título + lupa en la misma fila */}
              <Flex justify="flex-start" align="center">
                <Text fontSize="20px" fontWeight="bold">
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

              {/* Input de búsqueda (condicional) */}
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
                actualizarStock={actualizarStock}
                openConfirmDialog={openConfirmDialog}
                setAccesorioAEliminar={setAccesorioAEliminar}
              />
            ))}
          </Box>
        )}

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
          productos={productos}
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
          fetchModelos={fetchModelos}
        />
      )}
      <ModalConfirmacionDelete isOpen={isOpen} onClose={onClose} handleDeleteConfirm={handleDeleteConfirm} />

      {productoAEliminar || accesorioAEliminar && (
        <AlertDialog
          isOpen={isConfirmDialogOpen}
          leastDestructiveRef={cancelRef}
          onClose={closeConfirmDialog}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                {productoAEliminar ? `${obtenerNombreModelo(productoAEliminar.modeloId)} ${productoAEliminar.capacidad} ${productoAEliminar.color}` :
                accesorioAEliminar.nombre
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
                    if (productoAEliminar) {
                      actualizarStock(productoAEliminar.id, 0);
                      setProductoAEliminar(null);
                    }else{
                      actualizarStock(accesorioAEliminar.id, 0)
                    }
                    closeConfirmDialog();
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

    </Box>
  );
}

export default Productos;




