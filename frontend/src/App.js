import "./App.css";
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

// react router dom
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utils/ProtectedRoute";
import Home from "./Pages/Home";
import Report from "./Pages/Report";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Notfound from "./Pages/Notfound";
import StatusCheck from "./Pages/StatusCheck";
import About from "./Pages/About";
import PrivacyPolicies from "./Pages/PrivacyPolicies";
import UserDashboard from "./Pages/UserDashboard";
import Signup from "./Pages/Signup";
import Faq from "./Pages/Faq";
import Redeem from "./Pages/Redeem";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
         <Route path="/signup" element={<Signup />}></Route>
           <Route path="/about" element={<About />}></Route>
           <Route path="/privacy" element={<PrivacyPolicies />}></Route>
           <Route path="/faq" element={<Faq />}></Route>
           <Route path="*" element={<Notfound />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/redeem"
          element={
            <ProtectedRoute allowedRoles={["user","admin"]}>
              <Redeem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report"
          element={
            <ProtectedRoute allowedRoles={["user","admin"]}>
              <Report />
            </ProtectedRoute>
          }
        />
        <Route
          path="/status"
          element={
            <ProtectedRoute allowedRoles={["user","admin"]}>
              <StatusCheck />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;