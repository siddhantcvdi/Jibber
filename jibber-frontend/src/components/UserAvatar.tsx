import { useState } from "react";
import type { SearchUser } from "@/types";

const UserAvatar = ({ user }: { user: SearchUser }) => {
  const [imageError, setImageError] = useState(false);
  const getInitial = (username: string) =>
    username ? username.charAt(0).toUpperCase() : "U";

  if (!user.profilePhoto || imageError) {
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5e63f9] to-[#7c7fff] flex items-center justify-center text-white font-semibold">
        {getInitial(user.username)}
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-full overflow-hidden">
      <img
        src={user.profilePhoto}
        alt={user.username}
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
};

export default UserAvatar;
