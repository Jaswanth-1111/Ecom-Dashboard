import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/Approutes";
import Popup from "./components/Popup";
import "./App.css";

function App() {
  return (
    <Router>
      <AppRoutes />
      <Popup />
    </Router>
  );
}

export default App;