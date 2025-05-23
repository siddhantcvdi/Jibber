import { MenuIcon } from "lucide-react"
import ChatPreview from "./ContactPreview"

const ContactList = () => {
  return (
    <div className="h-screen w-1/4 min-w-[400px] max-md:w-full p-2 bg-neutral-50 outline-1 outline-neutral-200 poppins-regular">
        <div className="flex gap-4 items-center border-b-2 border-neutral-200">
            <span className="w-11 h-11 flex justify-center items-center rounded-full hover:bg-neutral-200 cursor-pointer duration-300"><MenuIcon size={20}/></span>
            <span className="text-xl text-neutral-800">Messages</span>
            <span className="px-2 h-fit text-xs py-0.5 bg-red-400 rounded-full text-white">13</span>
        </div>
        
        <div >
            <input type="text" placeholder="Search" className="bg-neutral-100 outline-1 outline-neutral-300 text-neutral-800 px-4 h-10 text-sm mt-4 w-full rounded-xl"/>
        </div>
        <div className="pt-5">
            <ChatPreview name="Siddhant Chaturvedi" lastChatText="Hello" icon="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" id="1234"/>
            <ChatPreview name="Donald Duck" lastChatText="Tired of Winning?" icon="https://images.moneycontrol.com/static-mcnews/2024/12/20241211112438_BeFunky-collage-2024-12-11T165424.810.jpg?impolicy=website&width=770&height=431" id = '4567'/>
            <ChatPreview name="Joe Who" lastChatText="Where am I?" icon="https://www.thoughtco.com/thmb/naT2Yc0Z1u0kz37osn29jkOSm-g=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1055820900-ed9e56a18e5e464e8b00620f1174dbfa.jpg" id='8901' />
        </div>
    </div>
  )
}

export default ContactList