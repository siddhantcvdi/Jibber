import { Route, Routes } from "react-router-dom"
import UserChats from "./pages/UserChats"
import Landing from "./pages/Index"

function App() {

  return (
    <>
    <Routes>
      <Route element={<Landing/>} path="/"/>
      <Route element={<UserChats/>} path="/chats"/>
    </Routes>
    </>
  )
}

export default App
