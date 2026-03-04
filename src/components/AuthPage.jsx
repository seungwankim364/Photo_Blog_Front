import { useState } from 'react';
import { buildApiUrl, parseJsonOrThrow } from '../utils/api';

export function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isSignup = mode === 'signup';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password || (isSignup && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(buildApiUrl(`/auth/${isSignup ? 'signup' : 'login'}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          isSignup
            ? { name: name.trim(), email: email.trim(), password }
            : { email: email.trim(), password }
        ),
      });

      const payload = await parseJsonOrThrow(response, 'Authentication failed');

      if (isSignup) {
        setMode('login');
        setName('');
        setPassword('');
        setSuccess('Sign up complete. Please log in.');
        return;
      }

      onAuthSuccess(payload);
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center justify-center mb-6 gap-2">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`px-4 py-2 rounded-lg text-sm ${
              mode === 'login' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
            }`}
            disabled={isSubmitting}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`px-4 py-2 rounded-lg text-sm ${
              mode === 'signup' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'
            }`}
            disabled={isSubmitting}
          >
            Sign Up
          </button>
        </div>

        <h1 className="text-2xl font-semibold text-center mb-2">{isSignup ? 'Create account' : 'Welcome back'}</h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          {isSignup ? 'Sign up to upload and manage your photos.' : 'Log in to continue to your journal.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-500"
              disabled={isSubmitting}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-500"
            disabled={isSubmitting}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-500"
            disabled={isSubmitting}
            required
          />

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-70"
          >
            {isSubmitting ? 'Please wait...' : isSignup ? 'Create account' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
