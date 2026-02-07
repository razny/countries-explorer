import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import CountryPage from "./pages/CountryPage";
import ComparisonPage from "./pages/ComparisonPage";

function App() {
  return (
    <BrowserRouter basename="/countries-explorer">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/country/:code" element={<CountryPage />} />
        <Route path="/compare" element={<ComparisonPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
