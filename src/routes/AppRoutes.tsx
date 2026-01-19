import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../modules/public/LandingPage";
import LoginPage from "../modules/auth/LoginPage";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProtectedRoute from "../auth/PreotectedRoute";
import AppHome from "../modules/app/AppHome";
import RegisterPage from "../modules/auth/RegisterPage";
import CreateCompanyPage from "../modules/onboarding/CreateCompanyPage";
import PublicRoute from "../auth/PublicRoute";
import EmployeesPage from "../modules/employees/EmployeesPage";
import EmployeeDetailPage from "../modules/employees/EmployeeDetailPage";
import CustomFieldsPage from "../modules/custom-fields/CustomFieldsPage";
import ProductsPage from "../modules/products/ProductsPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Public auth (only if NOT logged in) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Onboarding (logged in, but no company yet) */}
        <Route
          path="/onboarding/company"
          element={
            <ProtectedRoute>
              <CreateCompanyPage />
            </ProtectedRoute>
          }
        />

        {/* App / ERP */}
        <Route path="/app" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<AppHome />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="employees/:id" element={<EmployeeDetailPage />} />
          <Route path="products" element={<ProductsPage />} />
          
          <Route
            path="settings/custom-fields/employees"
            element={<CustomFieldsPage entity="employees" />}
          />

          <Route
            path="settings/custom-fields/clients"
            element={<CustomFieldsPage entity="clients" />}
          />

          <Route
            path="settings/custom-fields/products"
            element={<CustomFieldsPage entity="products" />}
          />
        </Route>


      </Routes>
    </BrowserRouter>
  );
}
