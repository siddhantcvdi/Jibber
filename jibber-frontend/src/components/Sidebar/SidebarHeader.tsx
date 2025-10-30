import { ThemeToggle } from '../ui/theme-toggle';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings, MoreVertical, User, LogOut} from 'lucide-react';
import authStore from '@/store/auth.store';


const SidebarHeader = () => {
  const navigate = useNavigate();
  const user  = authStore(select=>select.user)
  const getInitial = (username: string) => {
    return username ? username.charAt(0).toUpperCase() : 'U';
  };
  return (
    <div className="p-4 border-border">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-foreground">Jibber</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => navigate('/app/settings')}
                className="p-2 rounded-2xl hover:bg-accent text-muted-foreground transition-colors cursor-pointer"
              >
                <Settings size={18} />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-2xl hover:bg-accent text-muted-foreground transition-colors cursor-pointer">
                    <MoreVertical size={18} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 glassmorphism-header">
                  <div className="flex items-center gap-3 p-3 border-b border-border">
                    {
                      user?.profilePhoto != ""
                      ?<img src={user?.profilePhoto} alt="" className="w-10 h-10 sm:h-12 sm:w-12 rounded-full object-cover" />
                      :<div className="w-10 h-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-[#5e63f9] to-[#7c7fff] flex items-center justify-center text-white font-semibold">
                      {getInitial(user.username || '')}
                      </div>
                    }
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {user?.username || 'User'}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem
                    onClick={() => navigate('/app/settings')}
                    className="flex items-center gap-3 p-3 cursor-pointer"
                  >
                    <User size={16} />
                    <span>Profile & Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={()=>{}}
                    className="flex items-center gap-3 p-3 cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
  )
}

export default SidebarHeader