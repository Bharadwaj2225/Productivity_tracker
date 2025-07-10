
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Lock, Mail, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

export default function LoginPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (isLogin) {
        // Login logic
        const users = JSON.parse(localStorage.getItem('taskflow_users') || '[]');
        const user = users.find(u => u.email === formData.email && u.password === formData.password);
        
        if (user) {
          onLogin(user);
          toast({
            title: "Welcome back!",
            description: "Successfully logged in to TaskFlow Pro.",
          });
        } else {
          toast({
            title: "Login failed",
            description: "Invalid email or password.",
            variant: "destructive",
          });
        }
      } else {
        // Registration logic
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Password mismatch",
            description: "Passwords do not match.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const users = JSON.parse(localStorage.getItem('taskflow_users') || '[]');
        const existingUser = users.find(u => u.email === formData.email);
        
        if (existingUser) {
          toast({
            title: "Registration failed",
            description: "User with this email already exists.",
            variant: "destructive",
          });
        } else {
          const newUser = {
            id: Date.now(),
            name: formData.name,
            email: formData.email,
            password: formData.password,
            createdAt: new Date().toISOString()
          };
          
          users.push(newUser);
          localStorage.setItem('taskflow_users', JSON.stringify(users));
          
          onLogin(newUser);
          toast({
            title: "Account created!",
            description: "Welcome to TaskFlow Pro!",
          });
        }
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4"
            >
              <User className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-white">
              {isLogin ? 'Welcome Back' : 'Join TaskFlow Pro'}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {isLogin ? 'Sign in to your account' : 'Create your productivity account'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    {isLogin ? <User className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </div>
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-purple-300 hover:text-purple-200 transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
