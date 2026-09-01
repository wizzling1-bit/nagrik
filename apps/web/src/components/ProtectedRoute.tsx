import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles: ('CITIZEN' | 'CREATOR' | 'ADMIN')[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
  fallback
}) => {
  const { isAuthenticated, role, logout } = useAuth();

  // If user is not logged in
  if (!isAuthenticated || !role) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <Navigate to="/" replace />;
  }

  // If user is logged in, check role
  if (!allowedRoles.includes(role as any)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white border border-red-200 shadow-xl rounded-3xl p-8 max-w-md w-full text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-black text-slate-900">Access Denied (अनधिकृत पहुंच)</h2>

          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            इस पेज के लिए <strong>{allowedRoles.join(' / ')}</strong> रोल की आवश्यकता है। आपका वर्तमान रोल <strong>{role}</strong> है।
          </p>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>मुख्य पृष्ठ पर जाएं (Go Home)</span>
            </Link>

            <button
              onClick={logout}
              className="w-full bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition border border-red-200"
            >
              <LogOut className="w-4 h-4" />
              <span>दूसरे खाते से लॉगिन करें (Switch Account)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated and role is allowed
  return <>{children}</>;
};
