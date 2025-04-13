import { useEffect, useState } from "react";
import {
  Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalCloseButton, FormControl, FormLabel, Input, ModalFooter, Select,
  Text, Box, Flex, useToast,
} from "@chakra-ui/react";
import { updateProducto } from "../supabase/productos.service";
import { createModelo } from "../supabase/modelo.service";
import { categorias } from "../data";
import { fetchModelos } from "../services/fetchData";

function EditProduct({ isOpen, onClose, producto, modelos, productos, fetchProductos }: any) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [modelo, setModelo] = useState<any>();
  const [modeloOtro, setModeloOtro] = useState("");
  const [modeloError, setModeloError] = useState("");
  const [color, setColor] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [stock, setStock] = useState<number>();
  const [valorNeto, setValorNeto] = useState<number>();
  const [mayorista, setMayorista] = useState<number>();
  const [minorista, setMinorista] = useState<number>();
  const [nombreAccesorio, setNombreAccesorio] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const toast = useToast();

  useEffect(() => {
    if (producto) {
      const catObj = categorias.find((c: any) => c.id === producto.categoria);
      setCategoriaSeleccionada(catObj?.nombre ?? "");
      setModelo(producto.modeloId);
      setColor(producto.color);
      setCapacidad(producto.capacidad);
      setStock(producto.stock);
      setValorNeto(producto.valorNeto);
      setMayorista(producto.mayorista);
      setMinorista(producto.minorista);
      setNombreAccesorio(producto.nombre);
    }
  }, [producto]);

  const handleModeloOtroChange = (value: string) => {
    setModeloOtro(value);
    const existe = modelos.some((m: any) => m.nombre.toLowerCase() === value.toLowerCase());
    if (existe) {
      setModeloError("Este modelo ya existe. Buscalo en la lista.");
    } else {
      setModeloError("");
    }
  };

  const capitalizarPrimeraLetra = (texto: string) => {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  };

  const handleGuardar = async () => {
    let validationErrors: { [key: string]: string } = {};
    let modeloFinal: any;
    if (!categoriaSeleccionada) validationErrors.categoria = "La categoría es obligatoria.";
    const categoriaObj = categorias.find((cat: any) => cat.nombre === categoriaSeleccionada);
    const categoriaId = categoriaObj?.id;

    if (categoriaSeleccionada !== "Accesorio") {
      if (modelo === "Otro") {
        if (modeloError) {
          validationErrors.modeloOtro = modeloError;
        }
        if (!modeloOtro) {
          validationErrors.modeloOtro = "Debes ingresar el nuevo modelo.";
        }
        if (!modeloError && modeloOtro) {
          const res = await createModelo(modeloOtro);
          await fetchModelos();
          modeloFinal = res;
        }
      } else {
        modeloFinal = modelo;
      }
      if (!modeloFinal) validationErrors.modelo = "El modelo es obligatorio.";
      if (!color) validationErrors.color = "El color es obligatorio.";
      if (!capacidad) validationErrors.capacidad = "La capacidad es obligatoria.";
    } else {
      if (!nombreAccesorio) validationErrors.nombreAccesorio = "El nombre del accesorio es obligatorio.";
    }
    if (!stock) validationErrors.stock = "El stock es obligatorio.";
    if (!valorNeto) validationErrors.valorNeto = "El valor neto es obligatorio.";
    if (!mayorista) validationErrors.mayorista = "El mayorista es obligatorio.";
    if (!minorista) validationErrors.minorista = "El minorista es obligatorio.";
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const normalizeString = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const duplicado = productos.find((p: any) => {
      if (p.id === producto.id) return false;
      if (categoriaSeleccionada === "Accesorio") {
        return p.categoria === categoriaId &&
          normalizeString(p.nombre) === normalizeString(nombreAccesorio);
      } else {
        return (
          p.modeloId === modeloFinal &&
          p.categoria === categoriaId &&
          normalizeString(p.color) === normalizeString(color) &&
          normalizeString(p.capacidad) === normalizeString(capacidad)
        );
      }
    });

    if (duplicado) {
      setErrors({
        general: "Este producto ya existe. Modificá el stock desde la tabla correspondiente.",
      });
      return;
    }

    const dataToUpdate = {
      categoria: categoriaId,
      modeloId: modeloFinal,
      color: capitalizarPrimeraLetra(color),
      capacidad,
      stock,
      valorNeto,
      mayorista,
      minorista,
      nombre: nombreAccesorio,
    };

    try {
      await updateProducto(producto.id, dataToUpdate);
      await fetchProductos();
      onClose();
      toast({
        title: "Producto actualizado",
        description: "Los cambios se guardaron correctamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar el producto.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Producto</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {errors.general && (
            <Box bg="red.100" p={3} mb={4} borderRadius="md">
              <Text color="red.600" fontSize="sm" fontWeight="bold">
                {errors.general}
              </Text>
            </Box>
          )}

          {categoriaSeleccionada !== "Accesorio" && (
            <>
              <FormControl mb={3} isInvalid={!!errors.modelo}>
                <FormLabel>Modelo</FormLabel>
                <Select value={modelo} onChange={(e) => setModelo(e.target.value)}>
                  {modelos.map((m: any) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre}
                    </option>
                  ))}
                  <option value="Otro">Otro</option>
                </Select>
              </FormControl>

              {modelo === "Otro" && (
                <FormControl mb={3} isInvalid={!!errors.modeloOtro}>
                  <FormLabel>Nuevo Modelo</FormLabel>
                  <Input
                    value={modeloOtro}
                    onChange={(e) => handleModeloOtroChange(e.target.value)}
                  />
                  {modeloError && (
                    <Text color="red.500" fontSize="sm">{modeloError}</Text>
                  )}
                </FormControl>
              )}
              <FormControl mb={3} isInvalid={!!errors.color}>
                <FormLabel>Color</FormLabel>
                <Input value={color}
                  onChange={(e) => {
                    setColor(e.target.value);
                    setErrors((prev) => ({ ...prev, color: "" }));
                    if (errors.general) {
                      setErrors(prevErrors => ({ ...prevErrors, general: '' }));
                    }
                  }}
                />
                {errors.color && (
                  <Text color="red.500" fontSize="sm">{errors.color}</Text>
                )}
              </FormControl>
              <FormControl isInvalid={!!errors.capacidad}>
                <FormLabel>Capacidad</FormLabel>
                <Select
                  placeholder="Selecciona "
                  value={capacidad}
                  onChange={(e) => {
                    setCapacidad(e.target.value);
                    setErrors((prev) => ({ ...prev, capacidad: "" }));
                    if (errors.general) {
                      setErrors((prevErrors) => ({ ...prevErrors, general: '' }));
                    }
                  }}
                >
                  <option value="128GB">128GB</option>
                  <option value="256GB">256GB</option>
                </Select>
                {errors.capacidad && (
                  <Text color="red.500" fontSize="sm">{errors.capacidad}</Text>
                )}
              </FormControl>
            </>
          )}

          {categoriaSeleccionada === "Accesorio" && (
            <FormControl mb={3} isInvalid={!!errors.nombreAccesorio}>
              <FormLabel>Nombre Accesorio</FormLabel>
              <Input value={nombreAccesorio}
                onChange={(e) => {
                  setNombreAccesorio(e.target.value)
                  setErrors((prev) => ({ ...prev, nombreAccesorio: "" }));
                  if (errors.general) {
                    setErrors(prevErrors => ({ ...prevErrors, general: '' }));
                  }
                }}
              />
              {errors.nombreAccesorio && (
                <Text color="red.500" fontSize="sm">
                  {errors.nombreAccesorio}
                </Text>
              )}
            </FormControl>
          )}
          <Flex gap={2}>
            <FormControl mb={3} isInvalid={!!errors.stock}>
              <FormLabel>Stock</FormLabel>
              <Input type="number" value={stock}
                onChange={(e) => {
                  setStock(Number(e.target.value));
                  setErrors((prev) => ({ ...prev, stock: "" }));

                }}
              />
              {errors.stock && (
                <Text color="red.500" fontSize="sm">
                  {errors.stock}
                </Text>
              )}
            </FormControl>
            <FormControl mb={3} isInvalid={!!errors.valorNeto}>
              <FormLabel>Valor Neto</FormLabel>
              <Input type="number" value={valorNeto}
                onChange={(e) => {
                  setValorNeto(Number(e.target.value));
                  setErrors((prev) => ({ ...prev, valorNeto: "" }));
                }} />
              {errors.valorNeto && (
                <Text color="red.500" fontSize="sm">
                  {errors.valorNeto}
                </Text>
              )}
            </FormControl>
          </Flex>
          <Flex gap={2}>
            <FormControl mb={3} isInvalid={!!errors.mayorista}>
              <FormLabel>Precio Mayorista</FormLabel>
              <Input type="number" value={mayorista} onChange={(e) => {
                setMayorista(Number(e.target.value));
                setErrors((prev) => ({ ...prev, mayorista: "" }));
              }} />
              {errors.mayorista && (
                <Text color="red.500" fontSize="sm">
                  {errors.mayorista}
                </Text>
              )}
            </FormControl>
            <FormControl mb={3} isInvalid={!!errors.minorista}>
              <FormLabel>Precio Minorista</FormLabel>
              <Input type="number" value={minorista} onChange={(e) => {
                setMinorista(Number(e.target.value));
                setErrors((prev) => ({ ...prev, minorista: "" }));
              }} />
              {errors.minorista && (
                <Text color="red.500" fontSize="sm">
                  {errors.minorista}
                </Text>
              )}
            </FormControl>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleGuardar}>
            Guardar Cambios
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default EditProduct;
