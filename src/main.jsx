import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router';
import './index.css'
import ErrorpageOne from './errorpages/ErrorpageOne';
import Root from './root/Root';
import Home from './pages/Home';
import AllMovies from './pages/AllMovies';
import Login from './pages/Login';
import Register from './pages/Register';
import AddMovies from './pages/AddMovies';
import MyCollection from './pages/MyCollection';
import MovieDetails from './pages/MovieDetails';
// Import the new Watchlist component
import Watchlist from './pages/Watchlist'; 
import AuthProvider from './providers/AuthProvider';
import PrivateRoutes from './routes/PrivateRoutes';

const router = createBrowserRouter([
  {
    path: '/', 
    errorElement: <ErrorpageOne></ErrorpageOne>,
    Component: Root,
    children:[
      {index: true, Component: Home},
      {path: '/allmovie', Component: AllMovies},
      {path: '/login', Component: Login},
      {path: '/register', Component: Register},
      {path: '/movie/:id', Component: MovieDetails},
      {
        path: '/movies/add',
        Component: () => <PrivateRoutes><AddMovies /></PrivateRoutes>
      },
      {
        path: '/movies/my-collection',
        Component: () => <PrivateRoutes><MyCollection /></PrivateRoutes>
      },
      // --- WATCHLIST PRIVATE ROUTE ---
      {
        path: '/movies/watchlist',
        Component: () => <PrivateRoutes><Watchlist /></PrivateRoutes>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  </StrictMode>,
)