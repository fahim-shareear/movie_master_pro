import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router';
import './index.css'
import ErrorpageOne from './errorpages/ErrorpageOne';
import Root from './root/Root';

const router = createBrowserRouter([
  {
    path: '/', errorElement: ErrorpageOne,
    Component: Root
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)
