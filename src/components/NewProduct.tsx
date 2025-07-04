import { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Select,
  Text,
  Box,
  Flex,
  useToast,
  Image,
} from "@chakra-ui/react";
import { createProducto, uploadFotosProducto } from "../supabase/productos.service";
import { createModelo } from "../supabase/modelo.service";
import { Capacidad, capacidades, categorias } from "../data";
import { Modelo, Producto } from "../types";
import { fetchModelos, fetchProductos } from "../services/fetchData";

interface NewProductProps {
  isOpen: boolean;
  onClose: () => void;
  productos: Producto[];
  modelos: Modelo[];
}

function NewProduct({ isOpen, onClose, productos, modelos }: NewProductProps) {
  const [step, setStep] = useState(1);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [modelo, setModelo] = useState<any>();
  const [modeloOtro, setModeloOtro] = useState("");
  const [modeloError, setModeloError] = useState("");
  const [color, setColor] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [stock, setStock] = useState<string>("");
  // const [valorNeto, setValorNeto] = useState<string>("");
  const [mayorista, setMayorista] = useState<string>("");
  const [minorista, setMinorista] = useState<string>("");
  const [nombreAccesorio, setNombreAccesorio] = useState("");
  const toast = useToast();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

  const handleAgregarProducto = async () => {
    setIsSaving(true);
    let validationErrors: { [key: string]: string } = {};
    let modeloFinal;
    if (modelo === "Otro") {
      const res = await createModelo(modeloOtro)
      modeloFinal = res.nombre;
    }
    else {
      const modeloObj = modelos.find((mod: any) => mod.nombre === modelo)
      modeloFinal = modeloObj?.nombre
    }
    const categoriaObj = categorias.find((cat: any) => cat.nombre === categoriaSeleccionada);
    const categoriaId = categoriaObj?.id;

    if (!categoriaSeleccionada) validationErrors.categoria = "La categoría es obligatoria.";
    if (categoriaSeleccionada !== "Accesorio") {
      if (!modeloFinal) {
        validationErrors.modelo = "El modelo es obligatorio.";
      }

      if (modelo === "Otro" && modeloError) {
        validationErrors.modeloOtro = modeloError;
      }

      if (!color) {
        validationErrors.color = "El color es obligatorio.";
      }

      if (!capacidad) {
        validationErrors.capacidad = "La capacidad es obligatoria.";
      }
    } else {
      if (!nombreAccesorio) {
        validationErrors.nombreAccesorio = "El nombre del accesorio es obligatorio.";
      }
    }
    if (!stock) validationErrors.stock = "El stock es obligatorio.";
    if (!mayorista) validationErrors.mayorista = "El valor mayorista es obligatorio.";
    if (!minorista) validationErrors.minorista = "El valor minorista es obligatorio.";
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (categoriaSeleccionada === "Accesorio") {
      const normalizeString = (str: string) =>
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const accesorioDuplicado = productos.find(
        (p: any) =>
          p.categoria === categoriaId &&
          normalizeString(p.nombre) === normalizeString(nombreAccesorio)
      );
      if (accesorioDuplicado) {
        setErrors({
          ...validationErrors,
          general:
            "Este producto ya existe, por favor modifique el stock desde la tabla de Accesorios.",
        });
        return;
      }
    }
    else {
      const productoDuplicado = productos.find((p: any) => {
        return (
          p.modeloId === modeloFinal &&
          p.categoria === categoriaId &&
          p.color.toLowerCase() === color.toLowerCase() &&
          p.capacidad.toLowerCase() === capacidad.toLowerCase()
        );
      });
      if (productoDuplicado) {
        setErrors({
          ...validationErrors,
          general: "Este producto ya existe, por favor modifique el stock desde la tabla de Celulares.",
        });
        return;
      } else {
        setErrors(prev => ({ ...prev, general: "" }));
      }
    }

    try {

      console.log("MODELO", modeloFinal)

      // const neto = valorNeto ? Number(valorNeto) : 0;
      const productoId = await createProducto(Number(stock), categoriaId ?? 1, Number(mayorista), Number(minorista), capacidad, capitalizarPrimeraLetra(color), modeloFinal, nombreAccesorio)
      console.log("ID DE PRODUCTO NUEVO", productoId)
      await fetchProductos()
      onClose();
      await fetchModelos()
      setErrors({});
      setStep(1);
      setModeloOtro("");
      setModeloError("");

      toast({
        title: "Producto agregado",
        description: "El producto se ha creado correctamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      await uploadFotosProducto(Number(productoId), imagenes);

    }
    catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al crear el producto. Inténtelo nuevamente.",
        status: "error",
        duration: 3000,
        isClosable: true,
      }
      )
    } finally {
      setIsSaving(false);
    }
  }

  const tituloModal = categoriaSeleccionada ? `Agregar ${categoriaSeleccionada}` : "Agregar Nuevo Producto";

  const handleModeloOtroChange = (value: string) => {
    setModeloOtro(value);
    const existe = modelos.some((m: any) => m.nombre.toLowerCase() === value.toLowerCase());
    if (existe) {
      setModeloError("Este modelo ya existe. Buscalo en la lista de arriba.");
    } else {
      setModeloError("");
    }
  };

  const capitalizarPrimeraLetra = (texto: string) => {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { setStep(1); onClose(); }} size={{ base: "full", md: "xl" }}>
      <ModalOverlay />
      <ModalContent
        mt={{ base: '0', md: '5', lg: '20' }}
        borderTopRadius={{ base: '0', md: 'md' }}
      >
        <ModalHeader>{tituloModal}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {errors.general && (
            <Box bg="red.100" p={3} mb={4} borderRadius="md">
              <Text color="red.600" fontSize="sm" fontWeight="bold">
                {errors.general}
              </Text>
            </Box>
          )}
          {step === 1 && (
            <FormControl isRequired>
              <FormLabel>Selecciona la categoría</FormLabel>
              <Select
                placeholder="Seleccione una categoría"
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              >
                {categorias.map((cat: any) => (
                  <option key={cat.id} value={cat.nombre}>
                    {cat.nombre}
                  </option>
                ))}
              </Select>
            </FormControl>
          )}
          {step === 2 && categoriaSeleccionada !== "Accesorio" && (
            <>
              <Flex flexDirection={"row"} gap={6} mb={4}>
                <FormControl isRequired>
                  <FormLabel>Modelo</FormLabel>
                  <Select
                    placeholder="Selecciona un modelo"
                    value={modelo}
                    onChange={(e) => {
                      setModelo(e.target.value);
                      setModeloOtro("");
                      setModeloError("");
                      setErrors((prev) => ({ ...prev, modelo: "" }));
                      if (errors.general) {
                        setErrors(prevErrors => ({ ...prevErrors, general: '' }));
                      }
                    }}
                  >
                    {modelos.map((m: any) => (
                      <option key={m.id} value={m.nombre}>
                        {m.nombre}
                      </option>
                    ))}
                    <option value="Otro">Otro</option>
                  </Select>
                  {errors.modelo && (
                    <Text color="red.500" fontSize="sm">{errors.modelo}</Text>
                  )}
                </FormControl>
                {modelo === "Otro" && (
                  <FormControl isRequired mt={2} isInvalid={!!modeloError}>
                    <FormLabel>Nuevo modelo</FormLabel>
                    <Input
                      placeholder="Escribe el modelo"
                      value={modeloOtro}
                      onChange={(e) => {
                        if (errors.general) {

                          setErrors(prevErrors => ({ ...prevErrors, general: '' }));
                        }
                        handleModeloOtroChange(e.target.value)
                      }}
                    />
                    {modeloError && (
                      <Text color="red.500" fontSize="sm">
                        {modeloError}
                      </Text>
                    )}
                  </FormControl>
                )}
              </Flex>
              <Flex flexDirection={"row"} gap={6} mb={4}>
                <FormControl isRequired isInvalid={!!errors.color}>
                  <FormLabel>Color{categoriaSeleccionada === "iPhone Usado" && " y Batería"}</FormLabel>
                 <Input
  textTransform="uppercase" // se ve en mayúsculas
  value={color}
  onChange={(e) => {
    const valor = e.target.value.toUpperCase(); // también lo guarda en mayúsculas
    setColor(valor);
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
               
              </Flex>
            </>
          )}
          {step === 2 && (
            <>
              {categoriaSeleccionada === "Accesorio" && (
                <FormControl isRequired isInvalid={!!errors.nombreAccesorio} mb={4}>
                  <FormLabel>Nombre del Accesorio</FormLabel>
                  <Input placeholder="Nombre" value={nombreAccesorio}
                    onChange={(e) => {
                      const input = e.target.value;
                      const capitalizado = input.charAt(0).toUpperCase() + input.slice(1);

                      setNombreAccesorio(capitalizado);
                      setErrors((prev) => ({ ...prev, nombreAccesorio: "" }));

                      if (errors.general) {
                        setErrors(prevErrors => ({ ...prevErrors, general: '' }));
                      }
                    }} />
                  {errors.nombreAccesorio && (
                    <Text color="red.500" fontSize="sm">
                      {errors.nombreAccesorio}
                    </Text>
                  )}
                </FormControl>
              )}
              <Flex flexDirection={"row"} gap={6} mb={4}>
                <FormControl isRequired isInvalid={!!errors.stock}>
                  <FormLabel>Stock</FormLabel>
                  <Input type="number" value={stock} onChange={(e) => {
                    setStock(e.target.value);
                    setErrors((prev) => ({ ...prev, stock: "" }));
                  }} />
                  {errors.stock && (
                    <Text color="red.500" fontSize="sm">
                      {errors.stock}
                    </Text>
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
                {/* <FormControl>
                  <FormLabel>Valor Neto</FormLabel>
                  <Input type="number" value={valorNeto} onChange={(e) => {
                    setValorNeto(e.target.value);

                  }} />
                </FormControl> */}
              </Flex>
              <Flex flexDirection={"row"} gap={6} mb={4}>
                <FormControl isRequired isInvalid={!!errors.minorista}>
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
                <FormControl isRequired isInvalid={!!errors.mayorista}>
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
              </Flex>

              <Box mt={4}>
                <FormControl>
                  <FormLabel>Fotos del producto (máx. 4)</FormLabel>
                  <Input
                    type="file"
                    multiple
                    onChange={(e) => {
                      const files = e.target.files ? Array.from(e.target.files) : [];
                      if (files.length + imagenes.length > 4) {
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
                      const previews = nuevas.map((file) => URL.createObjectURL(file));
                      setPreviewUrls(previews);
                    }}
                  />
                  {previewUrls.length > 0 && (
                    <Flex mt={2} gap={3} wrap="wrap">
                      {previewUrls.map((url, index) => (
                        <Box key={index} position="relative">
                          <Image src={url} alt={`foto-${index}`} boxSize="80px" objectFit="cover" borderRadius="md" />
                          <Button
                            size="xs"
                            colorScheme="red"
                            position="absolute"
                            top="0"
                            right="0"
                            onClick={() => {
                              const nuevasImagenes = [...imagenes];
                              nuevasImagenes.splice(index, 1);
                              setImagenes(nuevasImagenes);
                              const nuevasPreviews = [...previewUrls];
                              nuevasPreviews.splice(index, 1);
                              setPreviewUrls(nuevasPreviews);
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
            </>
          )}

        </ModalBody>
        <ModalFooter>
          {step > 1 && (
            <Button
              onClick={() => {
                setStep(step - 1);
                setErrors((prev) => ({ ...prev, general: '' }));
              }}
              variant="outline"
              mr={3}
            >
              Atrás
            </Button>
          )}
          {step === 1 && (
            <Button colorScheme="blue" onClick={() => setStep(2)} isDisabled={!categoriaSeleccionada}>
              Siguiente
            </Button>
          )}
          {step === 2 && (
            <Button
              colorScheme="green"
              onClick={handleAgregarProducto}
              isDisabled={modelo === "Otro" && (!!modeloError || !modeloOtro)}
               isLoading={isSaving}
                        loadingText="Guardando"
            >
              Agregar
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default NewProduct;