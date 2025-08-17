import { Routes, Route, Navigate } from 'react-router';
import UserProvider from '../../context/UserContext';
import { getUserToken } from '../../utils/userToken';
import type { UserInitialValues } from '../../utils/types';
import LoginPage from '../../routes/login';
import HomePage from '../../routes/home';
import WorldIdPage from '../../routes/$worldId';
import ExportPage from '../../routes/$worldId/export';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import './App.css'

function App() {
  const initUserToken = getUserToken();

  const userInitialValues: UserInitialValues = {
    isLoggedIn: false,
    user: null,
    expiresAt: initUserToken?.expiry || null,
    accessToken: initUserToken?.value || '',
    applicationKey: null,
  };

  return (
    <UserProvider initialValues={userInitialValues}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/:worldId"
          element={
            <ProtectedRoute>
              <WorldIdPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:worldId/export"
          element={
            <ProtectedRoute>
              <ExportPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </UserProvider>
  );
}

export default App;