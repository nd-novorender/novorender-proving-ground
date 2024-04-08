import { useState } from "react";
import "./App.css";
import { Main } from "./pages/Main";

function App() {
  const [showSecondView, setShowSecondView] = useState(false);
  return (
    <>
      <div>
        <Main projectId="3b5e65560dc4422da5c7c3f827b6a77c" />
        {showSecondView && <Main projectId="3b5e65560dc4422da5c7c3f827b6a77c" />}
      </div>
      <button style={{position: 'absolute', left: 10, bottom: 10}} onClick={() => setShowSecondView(v => !v)}>Toggle second view</button>
    </>
  );
}

export default App;
