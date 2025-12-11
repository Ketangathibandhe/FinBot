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
      sparkSize={25}
      sparkRadius={20}
      sparkCount={8}
      duration={400}
    >
        <App />
        </ClickSpark>
      </BrowserRouter>
    
  </StrictMode>
);
