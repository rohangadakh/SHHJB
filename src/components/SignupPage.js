import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { db } from '../firebase';
import { ref, set, get } from 'firebase/database';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when signup starts
    try {
      const usernameRef = ref(db, 'users/' + username);
      const emailRef = ref(db, 'users/');

      const usernameSnapshot = await get(usernameRef);
      if (usernameSnapshot.exists()) {
        setError("Username already taken");
        setLoading(false); // Set loading to false if an error occurs
        return;
      }

      const emailSnapshot = await get(emailRef);
      let emailExists = false;
      emailSnapshot.forEach((childSnapshot) => {
        if (childSnapshot.val().email === email) {
          emailExists = true;
        }
      });

      if (emailExists) {
        setError("Email already registered");
        setLoading(false); // Set loading to false if an error occurs
        return;
      }

      const userRef = ref(db, 'users/' + username);
      await set(userRef, {
        username: username,
        email: email,
        password: password,
      });

      setError('');
      navigate('/login'); // Navigate to the login page
    } catch (error) {
      setError('Error occurred during signup');
      console.error(error);
    } finally {
      setLoading(false); // Ensure loading is stopped in any case
    }
  };

  return (
      <div className="min-h-screen flex justify-center items-center bg-zinc-950 p-4">
        <div className="w-full max-w-md bg-zinc-900 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-semibold text-white">Sign Up</h2>
              <p className="text-gray-400">Create an account to get started</p>
            </div>
            <form onSubmit={handleSignup} className="space-y-5">
              {error && <p className="text-red-500 text-center">{error}</p>}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-700 rounded-2xl bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                      required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-700 rounded-2xl bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                      required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-700 rounded-2xl bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                      required
                  />
                </div>
              </div>
              <button
                  type="submit"
                  className={`w-full py-3 px-4 border border-transparent rounded-2xl shadow-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading} // Disable the button while loading
              >
                {loading ? 'Loading...' : 'Sign Up'}
              </button>
            </form>
          </div>
          <div className="px-6 py-4 bg-zinc-800 border-t border-gray-700 rounded-b-3xl">
            <p className="text-sm text-center text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-400 hover:text-blue-500">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
  );
};

export default SignupPage;
