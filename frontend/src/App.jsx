import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Feed from './pages/Feed'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Verify from './pages/Verify'

function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/verify/:token" element={<Verify />} />

      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/feed"
        element={
          <Layout>
            <Feed />
          </Layout>
        }
      />
      <Route
        path="/profile"
        element={
          <Layout>
            <Profile />
          </Layout>
        }
      />
    </Routes>
  )
}

export default App