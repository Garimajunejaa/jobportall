import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
//import Navbar from './components/shared/Navbar'
import Login from './components/auth/Login'
import JobApplicants from './components/admin/JobApplicants';
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from "./components/admin/AdminJobs"
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'
import ProtectedRoute from './components/admin/ProtectedRoute'
import AdminDashboard from './components/admin/AdminDashboard'
import RecruiterProfile from './components/admin/RecruiterProfile'
import HeroSection from './components/HeroSection';

function ErrorBoundary() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
      <p className="text-gray-600 mb-4">We're sorry, but we couldn't find the page you're looking for.</p>
      <button 
        onClick={() => window.location.href = '/'} 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go to Home
      </button>
    </div>
  );
}

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/signup",
    element: <Signup />,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/jobs",
    element: <Jobs />,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/description/:id",
    element: <JobDescription />,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/browse",
    element: <Browse />,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/profile",
    element: <Profile />,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/admin",
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "dashboard",
        element: <ProtectedRoute><AdminDashboard/></ProtectedRoute>
      },
      {
        path: "companies",
        element: <ProtectedRoute><Companies/></ProtectedRoute>
      },
      {
        path: "companies/create",
        element: <ProtectedRoute><CompanyCreate/></ProtectedRoute>
      },
      {
        path: "companies/:id",
        element: <ProtectedRoute><CompanySetup/></ProtectedRoute>
      },
      {
        path: "jobs",
        element: <ProtectedRoute><AdminJobs/></ProtectedRoute>
      },
      {
        path: "jobs/create",
        element: <ProtectedRoute><PostJob/></ProtectedRoute>
      },
      {
        path: "jobs/:id/applicants",
        element: <ProtectedRoute><Applicants/></ProtectedRoute>
      },
      {
        path: "jobs/:jobId/applicants",
        element: <ProtectedRoute><JobApplicants /></ProtectedRoute>
      },
      {
        path: "profile",
        element: <ProtectedRoute><RecruiterProfile/></ProtectedRoute>
      }
    ]
  },
  {
    path: "/jobs/category/:category",
    element: <Jobs />,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/jobs/industry/:industry",
    element: <Jobs />,
    errorElement: <ErrorBoundary />
  },
  {
    path: "/jobs/location/:location",
    element: <Jobs />,
    errorElement: <ErrorBoundary />
  }
  // Remove this part
  // {
  //     path: "profile",
  //     element: <ProtectedRoute><RecruiterProfile /></ProtectedRoute>
  // }
]);

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RouterProvider router={appRouter} fallbackElement={null} />
        </PersistGate>
      </Provider>
    </div>
  );
}

export default App;
