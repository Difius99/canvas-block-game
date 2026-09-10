import "simplebar-react/dist/simplebar.min.css";
import "overlayscrollbars/overlayscrollbars.css";
import "react-datepicker/dist/react-datepicker.css";

import { createGlobalStyle, css } from "styled-components";

const resetCSS = css`
  html,
  body,
  div,
  span,
  applet,
  object,
  iframe,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  big,
  cite,
  code,
  del,
  dfn,
  em,
  img,
  ins,
  kbd,
  q,
  s,
  samp,
  small,
  strike,
  strong,
  sub,
  sup,
  tt,
  var,
  b,
  u,
  i,
  center,
  dl,
  dt,
  dd,
  ol,
  ul,
  li,
  fieldset,
  form,
  label,
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td,
  article,
  aside,
  canvas,
  details,
  embed,
  figure,
  figcaption,
  footer,
  header,
  hgroup,
  menu,
  nav,
  output,
  ruby,
  section,
  summary,
  time,
  mark,
  audio,
  video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  menu,
  nav,
  section {
    display: block;
  }
  body {
    line-height: 1;
  }
  ol,
  ul {
    list-style: none;
  }
  blockquote,
  q {
    quotes: none;
  }
  blockquote:before,
  blockquote:after,
  q:before,
  q:after {
    content: "";
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
`;

export const GlobalStyle = createGlobalStyle`
  ${resetCSS}

  @font-face {
    font-family: "Stapel Medium";
    font-style: normal;
    font-weight: 400;
    src: 
     url("src/assets/fonts/Stapel-Medium.woff2"),
     url("src/assets/fonts/Stapel-Medium.woff");
  }

  @font-face {
    font-family: "PT Root UI";
    font-style: normal;
    font-weight: 500;
    src: 
    url("src/assets/fonts/PTRootUI-Medium.woff2"),
    url("src/assets/fonts/PTRootUI-Medium.woff");
  }

  @font-face {
    font-family: "PT Root UI";
    font-style: normal;
    font-weight: 400;
    src: 
    url("src/assets/fonts/PTRootUI-Regular.woff2"),
    url("src/assets/fonts/PTRootUI-Regular.woff");
  }

  body {
    font-family: 'Inter', sans-serif;
    color: rgba(1, 35, 69, 1);
  }
  
  #root {
    isolation: isolate;
    // to make portals independent of app's stacking context
  }

  button, input  {
    font-family : inherit;
  }

  // Set z-index for NavBar (remove when add styles for Navbar) 
  body [id="root"] > div > :first-child {
    z-index: 1;
  }
  
  .simplebar-scrollbar::before {
    background: rgba(0, 0, 0, 0.15);
    opacity: 1 !important;
  }

  .os-scrollbar {
    --os-handle-bg: color-mix(
            in srgb,
            var(--colors-background-grayscale-2-heavy) 48%,
            transparent
    );
    --os-handle-bg-hover: color-mix(
            in srgb,
            var(--colors-background-grayscale-2-heavy) 80%,
            transparent
    );
    --os-handle-bg-active: color-mix(
            in srgb,
            var(--colors-background-grayscale-2-heavy) 80%,
            transparent
    );
    --os-handle-perpendicular-size-hover: 8px;
    --os-handle-perpendicular-size-active: 8px;
    --os-size: 12px;
    --os-padding-perpendicular: 3px;
    --os-padding-axis: 3px;
  }
  
  * {
    box-sizing: border-box;
  }
`;
