import React from "react";
import { Hypnosis } from "react-cssfx-loading";
import "./FullPageLoader.css";

function FullPageLoader({ color, height, width }) {
  return (
    <div id="build-code-loader-sym">
      <Hypnosis color={color} height={height} width={width} />
    </div>
  );
}

export default FullPageLoader;
