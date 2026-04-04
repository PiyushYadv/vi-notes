import React from "react";
import type { User } from "../contexts/AuthContext";
interface Props {
  user: User;
  logout: () => void;
}

const Navbar: React.FC<Props> = ({ user, logout }) => {
  return (
    <div className="navbar">
      <h2>Notes App</h2>

      <div className="user-section">
        <div className="avatar-placeholder">{user.name[0].toUpperCase()}</div>
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span className="user-email">{user.email}</span>
        </div>

        <button className="btn btn-logout" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
