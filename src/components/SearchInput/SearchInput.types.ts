export interface SearchInputProps {
  value: string;
  onInput: (value: string) => void;
  placeholder?: string;
  // nombre accesible del campo y del botón de limpiar
  label?: string;
  // en cuanto pasa a true enfoca el campo (al abrir la búsqueda)
  focused?: boolean;
}
