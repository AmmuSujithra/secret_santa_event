import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Menu from "./components/shared/menu";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Menu />
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
