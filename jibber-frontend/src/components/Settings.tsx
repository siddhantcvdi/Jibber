import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  User,
  Mail,
  Lock,
  Upload,
  Eye,
  EyeOff,
  Camera,
  AtSign,
} from 'lucide-react';
import api from '@/services/api';

const Settings = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [profileData, setProfileData] = useState({
    username: 'siddhantcvdi',
    email: 'siddhant@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<
    'profile' | 'account' | 'security'
  >('profile');  const [pillStyle, setPillStyle] = useState({ width: 0, left: 0 });

  const tabs = useMemo(() => [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Mail },
    { id: 'security', label: 'Security', icon: Lock },
  ], []);
  const updatePillPosition = useCallback((activeTab: string) => {
    if (!tabsRef.current) return;

    const tabButtons = tabsRef.current.querySelectorAll('button');
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    const activeButton = tabButtons[activeIndex];

    if (activeButton) {
      const containerRect = tabsRef.current.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      
      setPillStyle({
        width: buttonRect.width,
        left: buttonRect.left - containerRect.left,
      });
    }
  }, [tabs]);
  React.useEffect(() => {
    updatePillPosition(activeSection);
  }, [activeSection, updatePillPosition]);

  React.useEffect(() => {
    const handleResize = () => updatePillPosition(activeSection);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeSection, updatePillPosition]);

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateImage = async (file: File) => {
  if (!file) return;
  setIsLoading(true)
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'jibber'); 

  const res = await fetch('https://api.cloudinary.com/v1_1/dooinh7tf/image/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  setProfileImage(data.secure_url); 

  const updateRes = await api.post('/users/updateProfilePhoto', {
    url: data.secure_url
  })

  console.log(updateRes.data);
  setIsLoading(false)
};


  const handleSaveChanges = async (section: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log(`Saving ${section} changes:`, profileData);
    setIsLoading(false);
  };

  const isPasswordValid = () => {
    return (
      profileData.newPassword.length >= 8 &&
      profileData.newPassword === profileData.confirmPassword &&
      profileData.currentPassword.length > 0
    );
  };

  return (
    <div className="flex-1 flex flex-col p-2 md:pl-0 h-[100dvh] bg-muted dark:bg-background">
      {/* Header */}
      <div className='bg-background dark:bg-muted/20 h-full rounded-2xl shadow-lg'>

      <div className="border-b border-border p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-[#5e63f9] to-[#7c7fff] rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground">
              Manage your account preferences
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6 space-y-6">          {/* Navigation Tabs */}
          <div 
            ref={tabsRef}
            className="relative flex space-x-1 bg-muted rounded-lg p-1 pr-2"
          >
            {/* Animated Pill */}
            <div
              className="absolute top-1 bottom-1 bg-background rounded-md shadow-sm transition-all duration-300 ease-out"
              style={{
                width: `${pillStyle.width}px`,
                transform: `translateX(${pillStyle.left}px)`,
              }}
            />
            
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() =>
                  setActiveSection(id as 'profile' | 'account' | 'security')
                }
                className={`relative z-10 flex-1 flex items-center justify-center gap-2 -ml-1 px-4 py-2 rounded-md transition-colors duration-200 ${
                  activeSection === id
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>

          {/* Profile Section */}
          {activeSection === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#5e63f9] to-[#7c7fff] flex items-center justify-center overflow-hidden">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 w-7 h-7 bg-background border border-border rounded-full flex items-center justify-center cursor-pointer hover:bg-accent transition-colors">
                      <Camera className="w-3 h-3 text-muted-foreground" />
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>                  <div>
                    <h3 className="font-medium text-foreground">
                      Profile Picture
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Upload a new avatar for your profile
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                      </Button>                      {profileImage && selectedFile && (
                        <Button
                          size="sm"
                          onClick={() => updateImage(selectedFile)}
                          disabled={isLoading}
                          className="bg-gradient-to-r from-[#5e63f9] to-[#7c7fff] hover:from-[#4f53e6] hover:to-[#6c70e8] text-white"
                        >
                          {isLoading ? 'Updating...' : 'Update Image'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="profile-username">Username</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="profile-username"
                        value={profileData.username}
                        onChange={(e) =>
                          handleInputChange('username', e.target.value)
                        }
                        className="pl-10"
                        placeholder="Enter your username"
                      />
                    </div>
                    <Button
                      onClick={() => handleSaveChanges('username')}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-[#5e63f9] to-[#7c7fff] hover:from-[#4f53e6] hover:to-[#6c70e8] text-white"
                    >
                      {isLoading ? 'Updating...' : 'Update Username'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Section */}
          {activeSection === 'account' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="account-email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="account-email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      className="pl-10"
                      placeholder="Enter your email"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This will be used for account recovery and notifications
                  </p>
                </div>

                <Button
                  onClick={() => handleSaveChanges('account')}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#5e63f9] to-[#7c7fff] hover:from-[#4f53e6] hover:to-[#6c70e8] text-white"
                >
                  {isLoading ? 'Saving...' : 'Save Account Changes'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={profileData.currentPassword}
                      onChange={(e) =>
                        handleInputChange('currentPassword', e.target.value)
                      }
                      className="pl-10 pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={profileData.newPassword}
                      onChange={(e) =>
                        handleInputChange('newPassword', e.target.value)
                      }
                      className="pl-10 pr-10"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={profileData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange('confirmPassword', e.target.value)
                      }
                      className="pl-10 pr-10"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                {profileData.newPassword && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium text-foreground mb-2">
                      Password Requirements:
                    </p>
                    <div className="space-y-1 text-xs">
                      <div
                        className={`flex items-center gap-2 ${profileData.newPassword.length >= 8 ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${profileData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-muted-foreground'}`}
                        />
                        At least 8 characters
                      </div>
                      <div
                        className={`flex items-center gap-2 ${profileData.newPassword === profileData.confirmPassword && profileData.confirmPassword ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${profileData.newPassword === profileData.confirmPassword && profileData.confirmPassword ? 'bg-green-500' : 'bg-muted-foreground'}`}
                        />
                        Passwords match
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => handleSaveChanges('security')}
                  disabled={isLoading || !isPasswordValid()}
                  className="w-full bg-gradient-to-r from-[#5e63f9] to-[#7c7fff] hover:from-[#4f53e6] hover:to-[#6c70e8] text-white"
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      </div>

    </div>
  );
};

export default Settings;
