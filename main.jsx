import React from "react";
import { createRoot } from "react-dom/client";

// IMPORTANTE: importar o adaptador de storage ANTES do app.
// Ele define window.storage usando o Firestore, então loadShared/saveShared
// (usados dentro do sistema.jsx) passam a ler/gravar no Firebase.
import "./storage";

import App from "./sistema.jsx";

createRoot(document.getElementById("root")).render(<App />);
