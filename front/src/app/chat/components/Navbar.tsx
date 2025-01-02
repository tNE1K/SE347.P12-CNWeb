import React from 'react';

interface ChatListProps {
  onSelectChat: (chatId: string, receiver: string) => void;
}

interface UserDetail {
  id: string;
  name: string;
  fullname: string;
}

interface NavbarProps {
  userDetail?: UserDetail ;
}

const Navbar: React.FC<NavbarProps> = ({ userDetail }) => {
    console.log("userDetail", userDetail);
    return (
      <nav className="z-10 flex w-full items-center justify-between border-b border-gray-200 py-4 px-8">
        <div className="text-2xl font-bold">Messages</div>
        <div className="text-lg flex items-center space-x-4">
          <span>{userDetail ? userDetail.fullname : "Guest"}</span>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Settings</button>
        </div>
      </nav>
    );
  };
  

export default Navbar;