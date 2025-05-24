import { Route, Routes } from "react-router-dom"
import Landing from "./pages/Index"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ForgotPassword from "./pages/ForgotPassword"
import MainLayout from "./Layouts/MainLayout"
import ContactList from "./components/ContactList"
import ChatWindow from "./components/ChatWindow"
import Settings from "./components/Settings"


function App() {
  
  return (
    <>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/app/*" element={<MainLayout/>}>
        <Route index element={<ContactList/>}/>
        <Route path="chat/:id" element={<ChatWindow/>}/>
        <Route path="settings" element={<Settings/>}/>
      </Route>
    </Routes>
    </>
  )
}

export default App
