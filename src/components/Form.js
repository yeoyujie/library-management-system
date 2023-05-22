import React, { useRef, useEffect } from "react";

const Form = ({ handleSubmit, inputs, submitValue }) => {
  const firstInputRef = useRef();

  useEffect(() => {
    firstInputRef.current.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      {inputs.map(({ label, type, value, onChange, options }, index) => (
        <React.Fragment key={index}>
          <div style={{ width: "300px" }}>
            <label>
              {label}:
              {type === "select" ? (
                <select
                  value={value}
                  onChange={onChange}
                  ref={index === 0 ? firstInputRef : null}
                  disabled={label === "Author" && options && options.length === 1}
                >
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={onChange}
                  ref={index === 0 ? firstInputRef : null}
                  disabled={label === "Author" && options && options.length === 1}
                />
              )}
            </label>
          </div>
          <br />
        </React.Fragment>
      ))}
      <input type="submit" value={submitValue} />
    </form>
  );
};

export default Form;
