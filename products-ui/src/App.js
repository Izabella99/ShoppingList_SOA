import React from 'react';
import './App.css';
import ProductsComponent from "./ProductsComponent";
import {grommet, Grommet} from "grommet";
import "./index.css"

function App() {
  return (
      <Grommet full theme={grommet}>
        <ProductsComponent
            token='aa'
            username='Iza'
        />
      </Grommet>
  );
}

export default App;
