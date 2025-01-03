import React, { useState, useEffect } from 'react';

interface UserDetail {
  id: string;
  receiverName: string;
}

interface NavbarProps {
  userDetail: UserDetail;
  onSelectUser: (chatId: string, receiverName: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ userDetail, onSelectUser }) => {
  const [receiverName, setReceiverName] = useState(userDetail.receiverName);

  const handleSelectUser = (chatId: string, receiver: string) => {
    console.log("Selected user:", receiver);
    setReceiverName(receiver);
    onSelectUser(chatId, receiver);
  };

  useEffect(() => {
    handleSelectUser(userDetail.id, userDetail.receiverName);
  }, [userDetail]);

  return (
    <nav className="z-10 flex w-full items-center justify-between border-b border-gray-200 py-4 px-8">
      <div className="text-2xl font-bold">Messages</div>
      <div className="text-lg flex items-center space-x-4">
        <span>{receiverName}</span>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Settings</button>
      </div>
    </nav>
  );
};

export default Navbar;