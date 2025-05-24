import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Check, AtSign, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import jibber from "../assets/jibber-new.png";

interface PasswordRequirement {
  text: string;
  met: boolean;
}

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Password requirements validation
  const passwordRequirements: PasswordRequirement[] = [
    {
      text: "At least 8 characters",
      met: formData.password.length >= 8
    },
    {
      text: "Contains uppercase letter",
      met: /[A-Z]/.test(formData.password)
    },
    {
      text: "Contains lowercase letter",
      met: /[a-z]/.test(formData.password)
    },
    {
      text: "Contains number",
      met: /\d/.test(formData.password)
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call - replace with actual signup logic
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Signup attempt:", formData);
    setIsLoading(false);
  };

  const isFormValid = () => {
    return (
      formData.username.trim() &&
      formData.email.trim() &&
      passwordRequirements.every(req => req.met) &&
      formData.password === formData.confirmPassword
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-16 sm:pt-4 bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden font-[Poppins]">
      {/* Background decorative elements */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#5e63f9]/10 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#7c7fff]/10 rounded-full blur-3xl opacity-60"></div>
      
      {/* Header with theme toggle */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      {/* Back to home button */}
      <div className="absolute top-4 left-4 z-10">
        <Link to="/">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-xs sm:text-sm">
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-md sm:max-w-lg relative z-10 animate-fade-in">
        <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            {/* Logo */}
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-[#5e63f9] to-[#7c7fff] p-3 rounded-xl">
                <img src={jibber} alt="Jibber Logo" className="h-8 w-8" />
              </div>
            </div>
            
            <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
              Create your account
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm -mt-4 text-muted-foreground">
              Join thousands of users for secure, private messaging
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10 h-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {/* Password Requirements */}
                {formData.password && (
                  <div className="mt-3 space-y-1">
                    {passwordRequirements.map((requirement, index) => (
                      <div key={index} className="flex items-center space-x-2 text-xs">
                        <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                          requirement.met 
                            ? 'bg-green-500 text-white' 
                            : 'bg-muted border border-border'
                        }`}>
                          {requirement.met && <Check className="w-2 h-2" />}
                        </div>
                        <span className={requirement.met ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
                          {requirement.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="pl-10 pr-10 h-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Password Security Warning */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      <strong>Important:</strong> Please remember your password. If you forget it, all your chat history will be permanently deleted and cannot be recovered.
                    </p>
                  </div>
                </div>
              </div>

              {/* Signup Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-[#5e63f9] to-[#7c7fff] hover:from-[#4f53e6] hover:to-[#6c70e8] text-white font-medium text-sm sm:text-base transition-all duration-300 disabled:opacity-50"
                disabled={isLoading || !isFormValid()}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            {/* Login link */}
            <div className="mt-6 text-center">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="text-[#5e63f9] hover:text-[#4f53e6] font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
