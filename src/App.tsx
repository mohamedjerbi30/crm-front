import React from 'react';

//import Scss
import './assets/scss/themes.scss';

//import Route
import Route from './Routes'; // This should import your Routes/index.tsx

// Import Firebase Configuration file
// import { initFirebaseBackend } from "./helpers/firebase_helper";



function App() {
  return (
    <React.Fragment>
      <Route />
    </React.Fragment>
  );
}

export default App;