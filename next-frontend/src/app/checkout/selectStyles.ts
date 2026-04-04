import { StylesConfig } from "react-select";

// Типізуємо об'єкт стилів для кращих підказок у VS Code
export const customStyles: StylesConfig<any, false> = {
  control: (base) => ({
    ...base,
    background: "#1e293b", // Slate-800
    borderColor: "#334155", // Slate-700
    color: "white",
    padding: "5px",
    borderRadius: "8px",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#00f6ff", // Твій акцентний колір
    },
  }),
  menu: (base) => ({
    ...base,
    background: "#1e293b",
    zIndex: 100,
    border: "1px solid #334155",
  }),
  singleValue: (base) => ({
    ...base,
    color: "white",
  }),
  input: (base) => ({
    ...base,
    color: "white",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#94a3b8", // Slate-400 для підказок
  }),
  option: (base, state) => ({
    ...base,
    background: state.isFocused ? "#334155" : "#1e293b",
    color: "white",
    cursor: "pointer",
    "&:active": {
      background: "#00f6ff",
      color: "#0b1524",
    },
  }),
};
