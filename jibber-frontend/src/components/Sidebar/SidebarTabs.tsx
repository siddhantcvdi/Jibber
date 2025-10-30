interface ChatListTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: 'all', label: 'All Chats' },
  { id: 'requests', label: 'Requests' },
]

const SidebarTabs = ({ activeTab, setActiveTab }: ChatListTabsProps) => {
  const activeIndex = tabs.findIndex(tab => tab.id === activeTab);

  return (
    <div className="relative flex border-b border-border w-[95%] mx-auto">
      <div
        className="absolute bottom-0 h-0.5 bg-[#5e63f9] transition-transform duration-300 ease-out"
        style={{
          width: '50%', // Since we have 2 tabs, each takes 50%
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />

      {tabs.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={`flex-1 py-3 text-sm font-medium transition-colors relative cursor-pointer ${
            activeTab === id
              ? 'text-[#5e63f9]'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default SidebarTabs