import { useEffect, useState } from "react";
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
  Flex,
} from "@chakra-ui/react";
import { updateProducto } from "../supabase/productos.service";

function EditProduct({ isOpen, onClose, categorias, modelos, fetchProductos, producto }: any) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [modelo, setModelo] = useState<number | undefined>();
  const [color, setColor] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [stock, setStock] = useState<number>();
  const [valorNeto, setValorNeto] = useState<number>();
  const [mayorista, setMayorista] = useState<number>();
  const [minorista, setMinorista] = useState<number>();

  useEffect(() => {
    if (producto) {
      setCategoriaSeleccionada(producto.categoria);
      setModelo(producto.modeloId);
      setColor(producto.color);
      setCapacidad(producto.capacidad);
      setStock(producto.stock);
      setValorNeto(producto.valorNeto);
      setMayorista(producto.mayorista);
      setMinorista(producto.minorista);
    }
  }, [producto]);

  const handleSubmit = async () => {
    const dataToUpdate = {
      categoria: categoriaSeleccionada,
      modeloId: modelo,
      color,
      capacidad,
      stock,
      valorNeto,
      mayorista,
      minorista,
    };

    try {
      await updateProducto(producto.id, dataToUpdate);
      await fetchProductos();
      onClose();
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar Producto</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={3}>
            <FormLabel>Categoria</FormLabel>
            <Select value={categoriaSeleccionada} onChange={(e) => setCategoriaSeleccionada(e.target.value)}>
              {categorias.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Modelo</FormLabel>
            <Select value={modelo} onChange={(e) => setModelo(Number(e.target.value))}>
              {modelos.map((mod: any) => (
                <option key={mod.id} value={mod.id}>
                  {mod.nombre}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Color</FormLabel>
            <Input value={color} onChange={(e) => setColor(e.target.value)} />
          </FormControl>

          <FormControl mb={3}>
            <FormLabel>Capacidad</FormLabel>
            <Input value={capacidad} onChange={(e) => setCapacidad(e.target.value)} />
          </FormControl>

          <Flex gap={2}>
            <FormControl mb={3}>
              <FormLabel>Stock</FormLabel>
              <Input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Valor Neto</FormLabel>
              <Input type="number" value={valorNeto} onChange={(e) => setValorNeto(Number(e.target.value))} />
            </FormControl>
          </Flex>

          <Flex gap={2}>
            <FormControl mb={3}>
              <FormLabel>Precio Mayorista</FormLabel>
              <Input type="number" value={mayorista} onChange={(e) => setMayorista(Number(e.target.value))} />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Precio Minorista</FormLabel>
              <Input type="number" value={minorista} onChange={(e) => setMinorista(Number(e.target.value))} />
            </FormControl>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
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
