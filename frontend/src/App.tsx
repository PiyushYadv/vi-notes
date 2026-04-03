import { useState } from "react";

function App() {
  const [state, setState] = useState("");

  return (
    <div>
      <h1>Hello React</h1>

      <input
        value={state}
        onChange={(e) => setState(e.target.value)}
        placeholder="Type something..."
      />

      <p>{state}</p>
    </div>
  );
}

export default App;