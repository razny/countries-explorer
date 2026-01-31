import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import CountryPage from "./pages/CountryPage";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/country/:code" element={<CountryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
