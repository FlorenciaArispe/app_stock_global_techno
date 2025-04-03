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
} from "@chakra-ui/react";

interface Categoria {
  id: number;
  nombre: string;
}

interface NewProductProps {
  isOpen: boolean;
  onClose: () => void;
  categorias: Categoria[];
}

function NewProduct({ isOpen, onClose, categorias }: NewProductProps) {
  const [step, setStep] = useState(1);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [modelo, setModelo] = useState("");
  const [color, setColor] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [stock, setStock] = useState("");
  const [valorNeto, setValorNeto] = useState("");
  const [mayorista, setMayorista] = useState("");
  const [minorista, setMinorista] = useState("");
  const [nombreAccesorio, setNombreAccesorio] = useState("");

  const handleAgregarProducto = () => {
    const nuevoProducto =
      categoriaSeleccionada === "Accesorio"
        ? { categoria: categoriaSeleccionada, nombre: nombreAccesorio, stock, valorNeto, mayorista, minorista }
        : { categoria: categoriaSeleccionada, modelo, color, capacidad, stock, valorNeto, mayorista, minorista };

    console.log("Nuevo producto agregado:", nuevoProducto);
    setStep(1);
    onClose();
  };

  // 🆕 Actualiza el título dinámicamente
  const tituloModal = categoriaSeleccionada ? `Agregar ${categoriaSeleccionada}` : "Agregar Nuevo Producto";

  return (
    <Modal isOpen={isOpen} onClose={() => { setStep(1); onClose(); }}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{tituloModal}</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
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
              <FormControl>
                <FormLabel>Modelo</FormLabel>
                <Input value={modelo} onChange={(e) => setModelo(e.target.value)} />
              </FormControl>

              <FormControl>
                <FormLabel>Color</FormLabel>
                <Input value={color} onChange={(e) => setColor(e.target.value)} />
              </FormControl>

              <FormControl>
                <FormLabel>Capacidad</FormLabel>
                <Input value={capacidad} onChange={(e) => setCapacidad(e.target.value)} />
              </FormControl>
            </>
          )}

          {step === 2 && (
            <>
              {categoriaSeleccionada === "Accesorio" && (
                <FormControl>
                  <FormLabel>Nombre del Accesorio</FormLabel>
                  <Input value={nombreAccesorio} onChange={(e) => setNombreAccesorio(e.target.value)} />
                </FormControl>
              )}

              <FormControl>
                <FormLabel>Stock</FormLabel>
                <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
              </FormControl>

              <FormControl>
                <FormLabel>Valor Neto</FormLabel>
                <Input type="number" value={valorNeto} onChange={(e) => setValorNeto(e.target.value)} />
              </FormControl>

              <FormControl>
                <FormLabel>Mayorista</FormLabel>
                <Input type="number" value={mayorista} onChange={(e) => setMayorista(e.target.value)} />
              </FormControl>

              <FormControl>
                <FormLabel>Minorista</FormLabel>
                <Input type="number" value={minorista} onChange={(e) => setMinorista(e.target.value)} />
              </FormControl>
            </>
          )}
        </ModalBody>

        <ModalFooter>
          {step > 1 && (
            <Button onClick={() => setStep(step - 1)} variant="outline" mr={3}>
              Atrás
            </Button>
          )}

          {step === 1 && (
            <Button colorScheme="blue" onClick={() => setStep(2)} isDisabled={!categoriaSeleccionada}>
              Siguiente
            </Button>
          )}

          {step === 2 && (
            <Button colorScheme="green" onClick={handleAgregarProducto}>
              Agregar
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default NewProduct;
