/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';



const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    role: 'user',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      alert(`Registration Error: ${error.message}`);
      return;
    }

    if (data?.user) {
      const { error: roleError } = await supabase.from('profiles').insert([
        {
          id: data.user.id,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
        },
      ]);

      if (roleError) {
        alert(`Profile Error: ${roleError.message}`);
        return;
      }
    }

    alert('Registration successful! Please check your email to verify.');
    setIsRegistering(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      alert(`Login Error: ${error.message}`);
      return;
    }

    if (data?.user) {
      const { data: userRole, error: roleError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (roleError || !userRole) {
        alert('Failed to fetch user role. Please try again.');
        return;
      }

      localStorage.setItem('user', data.user.id);
      localStorage.setItem('role', userRole.role);
      alert(`Logged in as ${userRole.role.toUpperCase()}`);
      navigate('/');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md mt-24">
      <h1 className="text-3xl font-bold mb-4">
        {isRegistering ? 'Register' : 'Login'}
      </h1>
      <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-4">
        {isRegistering && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        {isRegistering && (
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        )}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        {isRegistering && (
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="user">User</option>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        )}
        <button
          type="submit"
          className={`w-full text-white p-2 rounded ${isRegistering ? 'bg-blue-500' : 'bg-green-500'}`}
        >
          {isRegistering ? 'Register' : 'Login'}
        </button>
      </form>
      <button
        onClick={() => setIsRegistering(!isRegistering)}
        className="mt-4 w-full text-blue-500 underline"
      >
        {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
      </button>
    </div>
  );
};

export default AuthPage;