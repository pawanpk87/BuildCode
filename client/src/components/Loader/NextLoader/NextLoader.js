import React from "react";
import { Ring } from "react-cssfx-loading";
import "./NextLoader.css";

function NextLoader({ color, height, width }) {
  return (
    <div id="build-code-next-loader-sym">
      <Ring color={color} height={height} width={width} />
    </div>
  );
}

export default NextLoader;
