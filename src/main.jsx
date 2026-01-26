import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router';
import './index.css'
import ErrorpageOne from './errorpages/ErrorpageOne';
import Root from './root/Root';
import Home from './pages/Home';
import AllMovies from './pages/AllMovies';

const router = createBrowserRouter([
  {
    path: '/', errorElement: <ErrorpageOne></ErrorpageOne>,
    Component: Root,
    children:[
      {index: true, Component: Home},
      {path: '/allmovie', Component: AllMovies},
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)
