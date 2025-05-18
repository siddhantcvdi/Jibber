import ChatWindow from "@/components/ChatWindow"
import ContactList from "@/components/ContactList"
import { useMediaQuery } from "react-responsive"
import { Outlet} from "react-router-dom"

const MainLayout = () => {
const isMobile = useMediaQuery({maxWidth: 768})
if(isMobile)
    return <Outlet/>

return (
    <div className="flex h-screen">
        <ContactList/>
        <ChatWindow/>
    </div>
)
}

export default MainLayout