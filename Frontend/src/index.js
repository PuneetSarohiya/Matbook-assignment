import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import configureStore from './store';

const store = configureStore();


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Provider store={store}>
    <App />
    <ToastContainer />
  </Provider>
  </BrowserRouter>
);

