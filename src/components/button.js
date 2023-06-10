import React from "react";

// this universal button component can be used as a general buttom template to be use across the whole app
// You do not need to use every prop here for the button to work
const Button = ({ id, onClick, buttonText, type }) => {
    return (
      // the id, type , onClick refer to the props being used by the HTML button tag
      <button
        id={id}
        type={type}
        onClick={onClick}
      >
        {buttonText}
      </button>
    );
  };
  
  export default Button;