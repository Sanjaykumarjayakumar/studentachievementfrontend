import { useEffect, useState } from "react";
import { User, Lock, Edit, Shield, Mail } from "lucide-react";
import "./AdminProfile.css";

const AdminProfile = ({ user }) => {
  const [profileUser, setProfileUser] = useState(user || {});
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setProfileUser(user);
      setFormData({
        name: user.name || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const avatar = profileUser?.name?.charAt(0)?.toUpperCase() || "A";

  const handleSave = () => {
    setEditing(false);
    setChangingPassword(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setChangingPassword(false);
  };

  const activeForm = editing || changingPassword;

  return (
    <div className="profile-page-simple">
      <div className="profile-card-simple">
        <div className="profile-header-simple">
          <div className="avatar-simple">
            <span>{avatar}</span>
          </div>
        </div>

        <div className="profile-body-simple">
          {!activeForm ? (
            <>
              <div className="details-section-simple">
                <div className="detail-item-simple">
                  <User size={20} className="detail-icon-simple" />
                  <div className="detail-text-simple">
                    <span className="detail-label-simple">Admin ID</span>
                    <span className="detail-value-simple">{profileUser?.adminId || "a101"}</span>
                  </div>
                </div>
                <div className="detail-item-simple">
                  <h2 className="profile-name-simple">{profileUser?.name || "Admin A101"}</h2>
                </div>
                <div className="detail-item-simple">
                  <Mail size={20} className="detail-icon-simple" />
                  <div className="detail-text-simple">
                    <span className="detail-label-simple">Email</span>
                    <span className="detail-value-simple">{profileUser?.email || "admin@example.com"}</span>
                  </div>
                </div>
              </div>
              <div className="profile-actions-simple">
                <button onClick={() => setEditing(true)}>
                  <Edit size={16} />
                  <span>Edit Profile</span>
                </button>
                <button onClick={() => setChangingPassword(true)}>
                  <Lock size={16} />
                  <span>Change Password</span>
                </button>
              </div>
            </>
          ) : (
            <div className="form-section-simple">
              <h3>{editing ? "Edit Profile" : "Change Password"}</h3>
              {editing && (
                <div className="form-group-simple">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
              )}
              {changingPassword && (
                <>
                  <div className="form-group-simple">
                    <label htmlFor="password">New Password</label>
                    <input type="password" id="password" />
                  </div>
                  <div className="form-group-simple">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input type="password" id="confirmPassword" />
                  </div>
                </>
              )}
              <div className="form-actions-simple">
                <button className="cancel" onClick={handleCancel}>Cancel</button>
                <button className="save" onClick={handleSave}>Save</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
