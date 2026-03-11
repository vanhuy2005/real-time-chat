import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-16 sm:pt-20 px-0 sm:px-4">
        {/* Main Application Window */}
        <div className="glass-panel rounded-none sm:rounded-2xl w-full max-w-6xl h-[calc(100vh-4rem)] sm:h-[calc(100vh-6rem)] overflow-hidden flex">
          
          {/* Sidebar Area: Visible if no user is selected OR on screens md and up */}
          <div className={`w-full md:w-80 flex-shrink-0 border-r border-base-300 md:block ${selectedUser ? "hidden" : "block"}`}>
            <Sidebar />
          </div>

          {/* Chat Container / Empty State Area: Visible if user IS selected OR on screens md and up */}
          <div className={`flex-1 flex flex-col md:flex ${!selectedUser ? "hidden md:flex" : "flex"}`}>
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default HomePage;
