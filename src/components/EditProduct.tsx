import { useEffect, useState } from "react";
import {
  Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalCloseButton, FormControl, FormLabel, Input, ModalFooter, Select,
  Text, Box, Flex, useToast,
  Image,
} from "@chakra-ui/react";
import { updateProducto, uploadFotosProducto } from "../supabase/productos.service";
import { createModelo } from "../supabase/modelo.service";
import { Capacidad, capacidades, categorias } from "../data";
import { fetchModelos } from "../services/fetchData";
import supabase from "../supabase/supabase.service";

function EditProduct({ isOpen, onClose, producto, modelos, productos, fetchProductos }: any) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [modelo, setModelo] = useState<any>();
  const [modeloOtro, setModeloOtro] = useState("");
  const [modeloError, setModeloError] = useState("");
  const [color, setColor] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [stock, setStock] = useState<string>("");
  const [valorNeto, setValorNeto] = useState<string>("");
  const [mayorista, setMayorista] = useState<string>("");
  const [minorista, setMinorista] = useState<string>("");
  const [nombreAccesorio, setNombreAccesorio] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const toast = useToast();
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

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
      if (producto) {
        setPreviewUrls(producto.fotos ?? []);
      }
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

    const dataToUpdate : any= {
      categoria: categoriaId,
      modeloId: modeloFinal,
      color: capitalizarPrimeraLetra(color),
      capacidad,
      stock,
      valorNeto: valorNeto ? Number(valorNeto) : 0,
      mayorista,
      minorista,
      nombre: nombreAccesorio,
    };

    try {

      const fotosOriginales = producto.fotos ?? [];
      const nuevasASubir = imagenes; // archivos nuevos a subir
      const urlsFinales = fotosOriginales.filter((url : string) =>
        previewUrls.includes(url)
      );

      if (nuevasASubir.length > 0) {
        const nuevasUrls = await uploadFotosProducto(producto.id, nuevasASubir);
        urlsFinales.push(...nuevasUrls);
      }
      const eliminadas = fotosOriginales.filter(
        (url: string) => !urlsFinales.includes(url)
      );

      if (eliminadas.length > 0) {
        const archivosAEliminar = eliminadas.map((url : string) =>
          url.split("/storage/v1/object/public/imagenes-productos/")[1]
        );
        await supabase.storage.from("imagenes-productos").remove(archivosAEliminar);
      }

      dataToUpdate.fotos = urlsFinales.slice(0, 4);

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
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al actualizar el producto.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }


  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", md: "xl" }}>
      <ModalOverlay />
      <ModalContent
        mt={{ base: '0', md: '5', lg: '20' }}
        borderTopRadius={{ base: '0', md: 'md' }}
      >
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
              <FormControl isRequired mb={3} isInvalid={!!errors.modelo}>
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
                <FormControl isRequired mb={3} isInvalid={!!errors.modeloOtro}>
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
              <FormControl isRequired mb={3} isInvalid={!!errors.color}>
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
              <FormControl isRequired isInvalid={!!errors.capacidad}>
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
                  {capacidades.map((opcion: Capacidad) => (
                    <option key={opcion.id} value={opcion.nombre}>
                      {opcion.nombre}
                    </option>
                  ))}
                </Select>
                {errors.capacidad && (
                  <Text color="red.500" fontSize="sm">{errors.capacidad}</Text>
                )}
              </FormControl>
            </>
          )}

          {categoriaSeleccionada === "Accesorio" && (
            <FormControl isRequired mb={3} isInvalid={!!errors.nombreAccesorio}>
              <FormLabel>Nombre Accesorio</FormLabel>
              <Input
                value={nombreAccesorio}
                onChange={(e) => {
                  const input = e.target.value;
                  const capitalizado = input
                    ? input.charAt(0).toUpperCase() + input.slice(1)
                    : "";

                  setNombreAccesorio(capitalizado);
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
          <Flex gap={2} mt={3}>
            <FormControl isRequired mb={3} isInvalid={!!errors.stock}>
              <FormLabel>Stock</FormLabel>
              <Input type="number" value={stock}
                onChange={(e) => {
                  setStock(e.target.value);
                  setErrors((prev) => ({ ...prev, stock: "" }));

                }}
              />
              {errors.stock && (
                <Text color="red.500" fontSize="sm">
                  {errors.stock}
                </Text>
              )}
            </FormControl>
            <FormControl mb={3} >
              <FormLabel>Valor Neto</FormLabel>
              <Input type="number" value={valorNeto}
                onChange={(e) => {
                  setValorNeto(e.target.value);
                }} />
            </FormControl>
          </Flex>
          <Flex gap={2}>
            <FormControl isRequired mb={3} isInvalid={!!errors.mayorista}>
              <FormLabel>Precio Mayorista</FormLabel>
              <Input type="number" value={mayorista} onChange={(e) => {
                setMayorista(e.target.value);
                setErrors((prev) => ({ ...prev, mayorista: "" }));
              }} />
              {errors.mayorista && (
                <Text color="red.500" fontSize="sm">
                  {errors.mayorista}
                </Text>
              )}
            </FormControl>
            <FormControl isRequired mb={3} isInvalid={!!errors.minorista}>
              <FormLabel>Precio Minorista</FormLabel>
              <Input type="number" value={minorista} onChange={(e) => {
                setMinorista(e.target.value);
                setErrors((prev) => ({ ...prev, minorista: "" }));
              }} />
              {errors.minorista && (
                <Text color="red.500" fontSize="sm">
                  {errors.minorista}
                </Text>
              )}
            </FormControl>
          </Flex>
          <Box mt={4}>
            <FormControl>
              <FormLabel>Fotos del producto (máx. 4)</FormLabel>
              <Input
                type="file"
                multiple
                onChange={(e) => {
                  const files = e.target.files ? Array.from(e.target.files) : [];
                  if (files.length + previewUrls.length > 4) {
                    toast({
                      title: "Límite de imágenes",
                      description: "Solo se permiten hasta 4 fotos por producto.",
                      status: "warning",
                      duration: 3000,
                      isClosable: true,
                    });
                    return;
                  }
                  const nuevas = [...imagenes, ...files].slice(0, 4);
                  setImagenes(nuevas);

                  const nuevasPreviews = [
                    ...previewUrls,
                    ...files.map((file) => URL.createObjectURL(file)),
                  ].slice(0, 4);
                  setPreviewUrls(nuevasPreviews);
                }}
              />
              {previewUrls.length > 0 && (
                <Flex mt={2} gap={3} wrap="wrap">
                  {previewUrls.map((url, index) => (
                    <Box key={index} position="relative">
                      <Image
                        src={url}
                        alt={`foto-${index}`}
                        boxSize="80px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                      <Button
                        size="xs"
                        colorScheme="red"
                        position="absolute"
                        top="0"
                        right="0"
                        onClick={() => {
                          const nuevasPreviews = [...previewUrls];
                          nuevasPreviews.splice(index, 1);
                          setPreviewUrls(nuevasPreviews);

                          const nuevasImagenes = [...imagenes];
                          nuevasImagenes.splice(index, 1);
                          setImagenes(nuevasImagenes);
                        }}
                      >
                        ×
                      </Button>
                    </Box>
                  ))}
                </Flex>
              )}
            </FormControl>
          </Box>

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
