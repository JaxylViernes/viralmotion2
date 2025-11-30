import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignUp";

import Dashboard from "./pages/user/D2.tsx";
import QuoteGenerator from "./trials/geminischematester.tsx";
import QuoteTester from "./trials/quotesapitester.tsx";
import { LandingPage } from "./pages/Landing.tsx";
import RequireAuth from "./pages/auth/AuthChecker.tsx";
import ForgotPasswordPage from "./pages/auth/ForgotPassword.tsx";
import  DynamicLayerEditor  from "./components/editor/DynamicLayerEditor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
      
        <Route path="/editor" element={<RequireAuth><DynamicLayerEditor /></RequireAuth>} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/" element={<LandingPage />} />

        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route path="/tester" element={<QuoteGenerator />} />
        <Route path="/qtester" element={<QuoteTester />} />
        {/* <Route path="/testpage" element={<QuoteTemplateEditor2 />} /> */}
      </Routes>
      {/* 👇 Must be rendered globally */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#fff",
            color: "#333",
          },
          success: {
            iconTheme: {
              primary: "#4f46e5", // Indigo
              secondary: "#fff",
            },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
