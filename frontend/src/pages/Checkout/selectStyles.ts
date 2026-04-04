export const customStyles = {
  control: (base: any) => ({
    ...base,
    background: "#1e293b",
    borderColor: "#334155",
    color: "white",
    padding: "5px",
    borderRadius: "8px",
  }),
  menu: (base: any) => ({
    ...base,
    background: "#1e293b",
    zIndex: 100,
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "white",
  }),
  input: (base: any) => ({
    ...base,
    color: "white",
  }),
  option: (base: any, state: any) => ({
    ...base,
    background: state.isFocused ? "#334155" : "#1e293b",
    color: "white",
    cursor: "pointer",
  }),
};
