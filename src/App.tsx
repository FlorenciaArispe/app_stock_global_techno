// App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { useEffect, useState } from "react";
import supabase from "./supabase/supabase.service";

function ProtectedRoute({ session }: { session: any }) {
  return session ? <Outlet /> : <Navigate to="/login" />;
}

function App() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    initSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute session={session} />}>
            <Route path="/inicio" element={<DashboardPage />} />
          </Route>
          <Route
            path="*"
            element={<Navigate to={session ? "/inicio" : "/login"} />}
          />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
