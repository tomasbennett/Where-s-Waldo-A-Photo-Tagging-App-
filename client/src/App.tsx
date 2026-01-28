
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { GeneralHomeLayout } from './layouts/GeneralHomeLayout'
import { ErrorElement } from './features/error/services/ErrorElement'
import { ErrorPageLayout } from './features/error/layouts/ErrorLayout'
import { PlayLayout } from './features/play/layouts/PlayLayout'
import { allPlayContextHandles } from './features/play/constants'



const router = createBrowserRouter([
  {
    path: "/",
    element: <GeneralHomeLayout />,
    errorElement: <ErrorElement />,
    children: [
      {
        index: true,
        element: <Navigate to="home" replace />
      },
      {
        path: "error",
        element: <ErrorPageLayout />,
      },
      {
        path: "home",
        element: <p>HOME PAGE</p>
      },
      {
        path: "play",
        element: <PlayLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/home" replace />
          },
          ...allPlayContextHandles.map((handle, index) => ({
            handle: handle,
            path: handle.backendRoute
          }))
        ]
      }
    ]
  }
]);






function App() {

  return (
    <>

      <RouterProvider router={router} />

    </>
  )
}

export default App
