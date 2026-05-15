import { Routes, Route, Navigate } from "react-router-dom";
import { StorefrontLayout } from "./components/storefront/StorefrontLayout";
import { AdminLayout } from "./components/admin/AdminLayout";
import { HomePage } from "./pages/storefront/HomePage";
import { ProductPage } from "./pages/storefront/ProductPage";
import { CartPage } from "./pages/storefront/CartPage";
import { CheckoutPage } from "./pages/storefront/CheckoutPage";
import { OrderConfirmedPage } from "./pages/storefront/OrderConfirmedPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminProducts } from "./pages/admin/AdminProducts";
import { AdminOrders } from "./pages/admin/AdminOrders";
import { AdminCashFlow } from "./pages/admin/AdminCashFlow";
import { AdminCalculator } from "./pages/admin/AdminCalculator";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminGuard } from "./components/admin/AdminGuard";

function App() {
  return (
    <Routes>
      {/* Storefront público */}
      <Route element={<StorefrontLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/produto/:slug" element={<ProductPage />} />
        <Route path="/carrinho" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/pedido/:id/confirmado" element={<OrderConfirmedPage />} />
      </Route>

      {/* Admin — login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin — protegido */}
      <Route element={<AdminGuard />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/produtos" element={<AdminProducts />} />
          <Route path="/admin/pedidos" element={<AdminOrders />} />
          <Route path="/admin/caixa" element={<AdminCashFlow />} />
          <Route path="/admin/calculadora" element={<AdminCalculator />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
