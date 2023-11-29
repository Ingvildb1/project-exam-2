import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [venueManager, setVenueManager] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);

  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Name validation
    const nameRegex = /^[a-zA-Z0-9_]*$/;
    if (!name.match(nameRegex)) {
      setRegistrationError('Invalid name format. Name must not contain punctuation symbols apart from underscore (_).');
      return;
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(stud\.noroff\.no|noroff\.no)$/;
    if (!email.match(emailRegex)) {
      setRegistrationError('Invalid email format. Please use an email ending with @stud.noroff.no or @noroff.no.');
      return;
    }

    // Password validation
    if (password.length < 8) {
      setRegistrationError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setRegistrationError('Passwords do not match.');
      return;
    }

    // Avatar URL validation
    try {
      if (avatar) new URL(avatar);
    } catch (error) {
      setRegistrationError('Invalid avatar URL. Please enter a valid URL.');
      return;
    }

    // Data for API request
    const data = {
      name,
      email,
      password,
      avatar: avatar || null,
      venueManager,
    };

    // API request
    try {
      const response = await fetch('https://api.noroff.dev/api/v1/holidaze/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        setRegistrationError(null);
        
        // Save the name in local storage
        localStorage.setItem('name', name);

        history.push('/login');
      } else {
        const responseData = await response.json();
        const errorMessage = responseData?.errors?.map((error) => error.message).join(', ') || 'Registration failed. Please check your credentials and try again.';
        setRegistrationError(errorMessage);
      }
    } catch (error) {
      setRegistrationError('Registration failed. Please try again later.');
    }
  };

  // Input change handlers
  const handleInputChange = (e, setState) => {
    setState(e.target.value);
  };

  const handleVenueManagerChange = (e) => {
    setVenueManager(e.target.checked);
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-[90vh] py-24">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow min-w-[80%] sm:min-w-[450px]">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Register</h2>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-900 font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => handleInputChange(e, setName)}
              className="w-full px-4 py-2 rounded border border-gray-400 focus:outline-none focus:border-indigo-500 text-gray-900"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-900 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => handleInputChange(e, setEmail)}
              className="w-full px-4 py-2 rounded border border-gray-400 focus:outline-none focus:border-indigo-500 text-gray-900"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-900 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => handleInputChange(e, setPassword)}
              className="w-full px-4 py-2 rounded border border-gray-400 focus:outline-none focus:border-indigo-500 text-gray-900"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-900 font-semibold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => handleInputChange(e, setConfirmPassword)}
              className="w-full px-4 py-2 rounded border border-gray-400 focus:outline-none focus:border-indigo-500 text-gray-900"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="avatarUrl" className="block text-gray-900 font-semibold mb-2">
              Avatar URL
            </label>
            <input
              type="text"
              id="avatarUrl"
              value={avatar}
              onChange={(e) => handleInputChange(e, setAvatar)}
              className="w-full px-4 py-2 rounded border border-gray-400 focus:outline-none focus:border-indigo-500 text-gray-900"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="isVenueManager" className="flex items-center cursor-pointer">
              <input type="checkbox" id="isVenueManager" className="mr-2 cursor-pointer" onChange={handleVenueManagerChange} />
              <span className="text-gray-900 font-semibold">I am a Venue Manager</span>
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 px-4 rounded font-semibold hover:bg-indigo-600 transition duration-300"
          >
            Register
          </button>
          {registrationError && (
            <div className="text-red-500 mt-4 text-center">{registrationError}</div>
          )}
          <div className="text-gray-900 mt-4 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-500 hover:text-indigo-600">
              Login here
            </a>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegisterForm;







