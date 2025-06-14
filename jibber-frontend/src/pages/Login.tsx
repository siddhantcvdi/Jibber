import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import jibber from '../assets/jibber-new.png';
import authStore from '@/store/auth.store';
import { toast } from 'sonner';

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { isAuthLoading, loginUser } = authStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      loginUser({
        usernameOrEmail: emailOrUsername,
        password,
      });
      toast.success('Logged In Successfully');
    } catch (err: any) {
      const message =
        err.response.data.message || err.message || 'An error occured';
      console.log(err);
      toast.error(message);
    }

    console.log('Login attempt:', { emailOrUsername, password, rememberMe });
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
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-md sm:max-w-lg relative z-10 animate-fade-in">
        <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm mx-4 sm:mx-0">
          <CardHeader className="text-center space-y-4 px-4 sm:px-6">
            {/* Logo */}
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-[#5e63f9] to-[#7c7fff] p-3 rounded-xl">
                <img src={jibber} alt="Jibber Logo" className="h-8 w-8" />
              </div>
            </div>

            <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground">
              Welcome back
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm -mt-4 text-muted-foreground">
              Sign in to your account to continue chatting securely
            </CardDescription>
          </CardHeader>

          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email/Username Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="emailOrUsername"
                  className="text-sm font-medium"
                >
                  Email or Username
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="emailOrUsername"
                    type="text"
                    placeholder="Enter your email or username"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    className="pl-10 h-11 text-sm sm:text-base"
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
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 text-sm sm:text-base"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked === true)
                    }
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#5e63f9] hover:text-[#4f53e6] transition-colors text-left sm:text-right cursor-pointer"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-[#5e63f9] to-[#7c7fff] hover:from-[#4f53e6] hover:to-[#6c70e8] text-white font-medium text-sm sm:text-base transition-all duration-300 disabled:opacity-50 cursor-pointer"
                disabled={isAuthLoading}
              >
                {isAuthLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            {/* Sign up link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-[#5e63f9] hover:text-[#4f53e6] font-medium transition-colors cursor-pointer"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
