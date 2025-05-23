import ChatWindow from "@/components/ChatWindow"
import ContactList from "@/components/ContactList"
import { useMediaQuery } from "react-responsive"
import { Outlet} from "react-router-dom"

const MainLayout = () => {
const isMobile = useMediaQuery({maxWidth: 768})

return (
    <div className="flex h-[100dvh] w-full overflow-hidden">
        {isMobile ? (
            <Outlet/>
        ) : (
            <>
                <ContactList/>
                <ChatWindow/>
            </>
        )}
    </div>
)
}

export default MainLayout