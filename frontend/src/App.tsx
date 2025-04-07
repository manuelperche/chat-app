import { BrowserRouter } from "react-router";
import LoginPage from "./pages/LoginPage";
import { Routes, Route } from "react-router";
import SignUpPage from "./pages/SignUpPage";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
