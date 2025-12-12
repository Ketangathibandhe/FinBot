import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ClickSpark from "./components/ReactBits/ClickSpark.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
 
      <BrowserRouter>
         <ClickSpark
      sparkColor="#fff"
      sparkSize={40}
      sparkRadius={25}
      sparkCount={10}
      duration={300}
    >
        <App />
        </ClickSpark>
      </BrowserRouter>
    
  </StrictMode>
);
