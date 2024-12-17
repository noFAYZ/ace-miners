import { useState } from "react";

export const Select = ({ options, ...rest }) => {
  const [selected, setSelected] = useState();
  return (
    <div>
      <select
        className="hidden"
        value={selected}
        onChange={(e) => console.log(e.target.value)}
        {...rest}
      >
        {options.map(({ label, value }, index) => (
          <option key={index} value={value}>
            {label}
          </option>
        ))}
      </select>
      <div>{selected}</div>
      <ul>
        {options.map(({ label, value }, index) => (
          <li key={index} onClick={() => setSelected(value)}>
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
};
