import { AnyActionArg, useState } from "react";
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
} from "@chakra-ui/react";
import { createProducto } from "../supabase/productos.service";

interface Categoria {
  id: number;
  nombre: string;
}

interface Modelo {
  id: number;
  nombre: string;
}



function NewProduct({ isOpen, onClose, categorias, productos, modelos , fetchProductos}: any) {
  const [step, setStep] = useState(1);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [modelo, setModelo] = useState("");
  const [modeloOtro, setModeloOtro] = useState("");
  const [modeloError, setModeloError] = useState("");
  const [color, setColor] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [stock, setStock] = useState();
  const [valorNeto, setValorNeto] = useState();
  const [mayorista, setMayorista] = useState();
  const [minorista, setMinorista] = useState();
  const [imei, setImei] = useState();
  const [nombreAccesorio, setNombreAccesorio] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const accesoriosFiltrados = productos.filter(
    (producto: any) => producto.categoria === 3
  );

  const handleAgregarProducto = async () => {
    console.log("entre")
    let validationErrors: { [key: string]: string } = {};
    const modeloFinal = modelo === "Otro" ? modeloOtro : modelo;

    const categoriaObj = categorias.find((cat) => cat.nombre === categoriaSeleccionada);
    const modeloObj = modelos.find((mod) => mod.nombre === modeloFinal);
  
    const categoriaId = categoriaObj?.id;
    const modeloId = modeloObj?.id;

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
      if (!imei) {
        validationErrors.imei = "El IMEI es obligatorio.";
      }
      
    } else {
      if (!nombreAccesorio) {
        validationErrors.nombreAccesorio = "El nombre del accesorio es obligatorio.";
      }
    }
    // if (!modeloFinal) validationErrors.modelo = "El modelo es obligatorio.";
    // if (modelo === "Otro" && modeloError) validationErrors.modeloOtro = modeloError;
    // if (!color) validationErrors.color = "El color es obligatorio.";
    // if (!capacidad) validationErrors.capacidad = "La capacidad es obligatoria.";
    if (!stock) validationErrors.stock = "El stock es obligatorio.";
    if (!valorNeto) validationErrors.valorNeto = "El valor neto es obligatorio.";
    if (!mayorista) validationErrors.mayorista = "El valor mayorista es obligatorio.";
    if (!minorista) validationErrors.minorista = "El valor minorista es obligatorio.";

    // if (categoriaSeleccionada === "Accesorio" && !nombreAccesorio) {
    //   validationErrors.nombreAccesorio = "El nombre del accesorio es obligatorio.";
    // }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("categorias",categoriaSeleccionada)

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
      console.log("categorias",categoriaSeleccionada)
      const productoDuplicado = productos.find((p: any) => {
        return (
          p.modeloId === modeloId &&
          p.categoria === categoriaId &&
          p.color.toLowerCase() === color.toLowerCase() &&
          p.capacidad.toLowerCase() === capacidad.toLowerCase()
        );
      });

      console.log("producto duplicado", productoDuplicado)
  
      if (productoDuplicado) {
        setErrors({
          ...validationErrors,
          general: "Este producto ya existe, por favor modifique el stock desde la tabla de Celulares.",
        });
        return;
      } else {
        // limpia error si ya no está duplicado
        setErrors(prev => ({ ...prev, general: "" }));
      }
    }

   // const nuevoProducto =
    //categoriaSeleccionada === "Accesorio"
     // ? 
      //await createProducto(stock, categoriaId, valorNeto , mayorista, minorista, null ,null , null, nombreAccesorio, imei )
      //: await createProducto(stock, categoriaId, valorNeto , mayorista, minorista, capacidad,color, modeloId, nombreAccesorio, imei )

  //console.log("Nuevo producto agregado:", nuevoProducto);

 await createProducto(stock, categoriaId, valorNeto , mayorista, minorista, capacidad,color, modeloId, nombreAccesorio, imei )
 fetchProductos()

  //ACA SE AGREGA EL NUEVO PRODUCTO
  //SI HAY UN NUEVO MODELO SE AGREGA TAMBIEN

   // Reset
   setErrors({});
   setStep(1);
   setModeloOtro("");
   setModeloError("");
   onClose();
  };

  const tituloModal = categoriaSeleccionada ? `Agregar ${categoriaSeleccionada}` : "Agregar Nuevo Producto";

  const handleModeloOtroChange = (value: string) => {
    setModeloOtro(value);
    const existe = modelos.some((m) => m.nombre.toLowerCase() === value.toLowerCase());
    if (existe) {
      setModeloError("Este modelo ya existe. Buscalo en la lista de arriba.");
    } else {
      setModeloError("");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { setStep(1); onClose(); }}>
      <ModalOverlay />
      <ModalContent>
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

{/* {errors.general && (
  <Text color="red.500" mt={2} fontSize="sm">
    {errors.general}
  </Text>
)}  */}
          {step === 1 && (
            <FormControl>
              <FormLabel>Selecciona la categoría</FormLabel>
              <Select
                placeholder="Seleccione una categoría"
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              >
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.nombre}>
                    {cat.nombre}
                  </option>
                ))}
              </Select>
            </FormControl>
          )}

          {step === 2 && categoriaSeleccionada !== "Accesorio" && (
            <>
            <Flex flexDirection={"row"}  gap={6} mb={4}>
              <FormControl>
                <FormLabel>Modelo</FormLabel>
                <Select
                  placeholder="Selecciona un modelo"
                  value={modelo}
                  onChange={(e) => {
                    setModelo(e.target.value);
                    setModeloOtro("");
                    setModeloError("");
                    if (errors.general) {
                        console.log("entre")
                        setErrors(prevErrors => ({ ...prevErrors, general: '' }));
                      }
                  }}
                >
                  {modelos.map((m) => (
                    <option key={m.id} value={m.nombre}>
                      {m.nombre}
                    </option>
                  ))}
                  <option value="Otro">Otro</option>
                </Select>
              </FormControl>

              {modelo === "Otro" && (
                <FormControl mt={2} isInvalid={!!modeloError}>
                  <FormLabel>Nuevo modelo</FormLabel>
                  <Input
                    placeholder="Escribe el modelo"
                    value={modeloOtro}
                    onChange={(e) => {
                      if (errors.general) {
                        console.log("entre")
                        setErrors(prevErrors => ({ ...prevErrors, general: '' }));
                      }
                      handleModeloOtroChange(e.target.value)
                      
                    }
                    }
                  />
                  {modeloError && (
                    <Text color="red.500" fontSize="sm">
                      {modeloError}
                    </Text>
                  )}
                </FormControl>
              )}
              </Flex>

<FormControl isInvalid={!!errors.imei}  mb={4}>
  <FormLabel>IMEI</FormLabel>
  <Input
    value={imei}
    onChange={(e) => {
      setImei(e.target.value);
      setErrors((prev) => ({ ...prev, imei: "" }));
      if (errors.general) {
        setErrors((prevErrors) => ({ ...prevErrors, general: "" }));
      }
    }}
  />
  {errors.imei && (
    <Text color="red.500" fontSize="sm">
      {errors.imei}
    </Text>
  )}
</FormControl>
<Flex flexDirection={"row"}  gap={6}  mb={4}>
<FormControl isInvalid={!!errors.color}>
  <FormLabel>Color</FormLabel>
  <Input
    value={color}
    onChange={(e) => {
      setColor(e.target.value);
      setErrors((prev) => ({ ...prev, color: "" }));
      if (errors.general) {
        console.log("entre")
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
  <Input
  value={capacidad}
  onChange={(e) => {
    setCapacidad(e.target.value);
    setErrors((prev) => ({ ...prev, capacidad: "" }));
    if (errors.general) {
      console.log("entre")
      setErrors(prevErrors => ({ ...prevErrors, general: '' }));
    }
  }}
/>

</FormControl>
</Flex>
            </>
          )}

          {step === 2 && (
            <>
              {categoriaSeleccionada === "Accesorio" && (
               <FormControl isInvalid={!!errors.nombreAccesorio}  mb={4}>
               <FormLabel>Nombre del Accesorio</FormLabel>
               <Input value={nombreAccesorio} onChange={(e) => {
                setNombreAccesorio(e.target.value)
                setErrors((prev) => ({ ...prev, nombreAccesorio: "" }));
                if (errors.general) {
                  console.log("entre")
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

<Flex flexDirection={"row"}  gap={6}  mb={4}> 

<FormControl isInvalid={!!errors.stock}>
  <FormLabel>Stock</FormLabel>
  <Input type="number" value={stock} onChange={(e) => {
    setStock(e.target.value)
    setErrors((prev) => ({ ...prev, stock: "" }));

    }} />
  {errors.stock && (
    <Text color="red.500" fontSize="sm">
      {errors.stock}
    </Text>
  )}
</FormControl>

<FormControl isInvalid={!!errors.valorNeto}>
  <FormLabel>Valor Neto</FormLabel>
  <Input type="number" value={valorNeto} onChange={(e) => {
    setValorNeto(e.target.value)
    setErrors((prev) => ({ ...prev, valorNeto: "" }));
    }} />
  {errors.valorNeto && (
    <Text color="red.500" fontSize="sm">
      {errors.valorNeto}
    </Text>
  )}
</FormControl>
</Flex>
<Flex flexDirection={"row"}  gap={6}  mb={4}>
<FormControl isInvalid={!!errors.minorista}>
  <FormLabel>Precio Minorista</FormLabel>
  <Input type="number" value={minorista} onChange={(e) => {
    setMinorista(e.target.value)
    setErrors((prev) => ({ ...prev, minorista: "" }));
    }} />
  {errors.minorista && (
    <Text color="red.500" fontSize="sm">
      {errors.minorista}
    </Text>
  )}
</FormControl>

<FormControl isInvalid={!!errors.mayorista}>
  <FormLabel>Precio Mayorista</FormLabel>
  <Input type="number" value={mayorista} onChange={(e) => {
    setMayorista(e.target.value)
    setErrors((prev) => ({ ...prev, mayorista: "" }));
    }} />
  {errors.mayorista && (
    <Text color="red.500" fontSize="sm">
      {errors.mayorista}
    </Text>
  )}
</FormControl>
</Flex>


            </>
          )}
        </ModalBody>
        

        <ModalFooter>
       
        {step > 1 && (
    <Button
      onClick={() => {
        setStep(step - 1);
        setErrors((prev) => ({ ...prev, general: '' })); // ✅ limpia el error
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
