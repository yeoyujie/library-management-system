import React from 'react';

const Form = ({
  handleSubmit,
  inputs,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      {inputs.map(({ label, value, onChange }, index) => (
        <React.Fragment key={index}>
          <label>
            {label}:
            <input type="text" value={value} onChange={onChange} />
          </label>
          <br />
        </React.Fragment>
      ))}
      <input type="submit" value="Search" />
    </form>
  );
};

export default Form;