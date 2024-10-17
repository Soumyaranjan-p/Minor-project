import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ProductContextProvider } from "./context/ProductContext.jsx";
import { UserContextProvider } from "./context/UserContext.jsx";
import { CartContextProvider } from "./context/CartContext.jsx";

export const server = "http://localhost:8007";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserContextProvider>
      <ProductContextProvider>
        <CartContextProvider>
          <App />
        </CartContextProvider>
      </ProductContextProvider>
    </UserContextProvider>
  </React.StrictMode>
);
