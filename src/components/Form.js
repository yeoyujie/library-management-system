import React, { useEffect, useRef } from "react";

const Form = ({ handleSubmit, inputs, submitValue }) => {
  const firstInputRef = useRef();

  useEffect(() => {
    firstInputRef.current.focus();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      {inputs.map(({ label, value, onChange }, index) => (
        <React.Fragment key={index}>
          <label>
            {label}:
            <input
              type="text"
              value={value}
              onChange={onChange}
              ref={index === 0 ? firstInputRef : null}
            />
          </label>
          <br />
        </React.Fragment>
      ))}
      <input type="submit" value={submitValue} />
    </form>
  );
};

export default Form;
