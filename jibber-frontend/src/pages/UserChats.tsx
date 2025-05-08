import ChatArea from "../components/ChatArea"
import Sidebar from "../components/Sidebar"
import SideInfo from "../components/SideInfo"

const UserChats = () => {
  return (
    <div className="flex h-screen w-full">
        <Sidebar/>
        <ChatArea/>
        <SideInfo/>
    </div>
  )
}

export default UserChats