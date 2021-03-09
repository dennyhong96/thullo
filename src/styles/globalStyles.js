import { reset } from "styled-reset";
import theme from "./theme";
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`

  /* RESET CSS */
  ${reset}

  /* BASE STYLES */
  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 62.5%;
    scroll-behavior: smooth;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar {
    width: 11px;
  }
  ::-webkit-scrollbar-track {
    background: #f7f7f7;
  }
  ::-webkit-scrollbar-thumb {
    background-color: ${theme.colors.textLightest};
    border-radius: 6px;
    border: 3px solid #f7f7f7;
  }

  body {
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
    font-size: 1.6rem;
    line-height: 1.5;
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
    scrollbar-width: thin;
    scrollbar-color: ${theme.colors.textLightest} #f7f7f7;
  }

  input {
    border: none;
    font: inherit;
  }

  a {
    display: inline-block;
    text-decoration: none;
    font: inherit;
    font-size: 1.4rem;
    text-transform: uppercase;
    font-weight: 500;
  }

  button {
    display: inline-block;
    border: none;
    font: inherit;
    cursor: pointer;
    background-color: transparent;
  }

  img {
    display: block;
    max-width: 100%;
  }

  h3, .h3 {
    font-weight: 500;
    font-size: 1.6rem;
    line-height: 1.375;
    -spacing: -0.035em;
  }

  h5 {
    font-weight: bold;
		font-size: 1.5rem;
		line-height: 1.2;
    color: ${theme.colors.textLight};
		margin-bottom: 0.5rem;
  }

  small, .small {
    font-weight: 500;
    font-size: 1rem;
    line-height: 1.5rem;

  }

  strong {
    font-weight: 500;
  }

  /* Focus styles */
  a, button, input, textarea {
    &:focus, &:active {
      outline: 1px solid ${theme.colors.background};
    }
  }
`;

export default GlobalStyles;
