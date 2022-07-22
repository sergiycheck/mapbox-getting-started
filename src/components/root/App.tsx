import React from "react";
import MapboxCustomMap from "../map-component/mapbox-custom";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>map will be here</h1>
      </header>

      <section>
        <article>
          <MapboxCustomMap />
        </article>
      </section>
    </div>
  );
}

export default App;
