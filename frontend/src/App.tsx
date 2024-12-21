import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import UserDashboard from "./pages/UserDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import LibrarianDashboard from "./pages/LibrarianDashboard"
import Books from "./pages/Books"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/signup" element={<Signup />}/>
          <Route path="/home" element={<UserDashboard />}/>
          <Route path="/admin" element={<AdminDashboard />}/>
          <Route path="/librarian" element={<LibrarianDashboard />}/>
          <Route path="/books" element={<Books />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
