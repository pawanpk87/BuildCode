import React from "react";
import LoadingOverlay from "react-loading-overlay";
import styled, { css } from "styled-components";
import "./Loading.css";

LoadingOverlay.propTypes = undefined;

const DarkBackground = styled.div`
  display: none;
  position: fixed;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
  ${(props) =>
    props.disappear &&
    css`
      display: block;
    `}
`;

function Loading({ loaded, text }) {
  return (
    <div className="loading-content">
      <DarkBackground disappear={!loaded}>
        <LoadingOverlay
          active={true}
          spinner={true}
          text={text}
        ></LoadingOverlay>
      </DarkBackground>
    </div>
  );
}

export default Loading;
