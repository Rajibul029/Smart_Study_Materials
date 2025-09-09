import React, { useState } from 'react';

// Main App component
export default function App() {
  const [studentId, setStudentId] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [isSending, setIsSending] = useState(false);
  const [sendingButton, setSendingButton] = useState(null); // 'gmail' or 'whatsapp'
  const [materials, setMaterials] = useState([]); // New state to store materials data

  const BASE_URL = 'https://smartstudymaterials-production.up.railway.app'; 



  const handleSendViaEmail = async () => {
    // Basic validation
    if (!studentId) {
      setMessage('Please enter your Student ID.');
      setMessageType('error');
      setMaterials([]); // Clear materials on error
      return;
    }

    // Set sending state and which button is being used
    setIsSending(true);
    setSendingButton('gmail');
    setMessage('');
    setMessageType('');
    setMaterials([]); // Clear previous materials before a new request

    try {
      // Make a POST request to the new backend API endpoint to send the email
      const response = await fetch(`${BASE_URL}/api/send-materials-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId }),
      });

      // Check if the response is valid JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        setIsSending(false);
        setSendingButton(null);
        setMessage('Could not connect to the server. Please ensure the backend is running.');
        setMessageType('error');
        return;
      }

      // Parse the JSON response
      const data = await response.json();

        setIsSending(false);
        setSendingButton(null);

        if (response.ok) {
          // If the email was sent successfully
          setMessage('Materials sent successfully to your email!');
          setMessageType('success');
        } else {
          // If the email failed to send, display the error message from the backend
          setMessage(data.message || 'Failed to send materials. Please try again.');
          setMessageType('error');
        }


    } catch (error) {
      // Handle network errors (e.g., backend is not running, or failed to parse JSON)
      console.error("Error connecting to backend:", error);
      setIsSending(false);
      setSendingButton(null);
      setMessage('Could not connect to the server. Please ensure the backend is running and you have correct email credentials.');
      setMessageType('error');
    }
  };

  const handleSendViaWhatsApp = async () => {
    // Basic validation
    if (!studentId) {
      setMessage('Please enter your Student ID.');
      setMessageType('error');
      setMaterials([]); // Clear materials on error
      return;
    }

    // Set sending state and which button is being used
    setIsSending(true);
    setSendingButton('whatsapp');
    setMessage('');
    setMessageType('');
    setMaterials([]); // Clear previous materials before a new request

    try {
      // Make a POST request to the new backend API endpoint
      const response = await fetch(`${BASE_URL}/api/send-materials-whatsapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId }),
      });

      // Check if the response is valid JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        setIsSending(false);
        setSendingButton(null);
        setMessage('Server returned an unexpected response. Is the backend running?');
        setMessageType('error');
        return;
      }

      const data = await response.json();

      // Simulate a loading delay
      setTimeout(() => {
        setIsSending(false);
        setSendingButton(null);

        if (response.ok) {
          // If the student ID is valid, open the WhatsApp URL
          window.open(data.whatsappUrl, '_blank');
          setMessage('Redirecting to WhatsApp with materials...');
          setMessageType('success');
        } else {
          // If the student ID is invalid, display the error message from the backend
          setMessage(data.message || 'Failed to open WhatsApp. Please try again.');
          setMessageType('error');
        }
      }, 1000); // 1-second delay to simulate sending

    } catch (error) {
      // Handle network errors (e.g., backend is not running)
      console.error("Error connecting to backend:", error);
      setIsSending(false);
      setSendingButton(null);
      setMessage('Could not connect to the server. Please ensure the backend is running.');
      setMessageType('error');
    }
  };
  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center p-4"
      style={{ backgroundImage: `url('https://c0.wallpaperflare.com/preview/534/41/125/school-books-young-adult-education.jpg')`, }}
    >
      {/* Header and Navigation */}
      <header className="w-full max-w-4xl p-4 md:p-5 mb-8 bg-white bg-opacity-80 backdrop-blur-md shadow-lg rounded-xl flex justify-between items-center z-10">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 text-white p-2 rounded-full shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open h-6 w-6"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" /></svg>
          </div>
          <h1 className="text-xl font-bold text-gray-800 hidden sm:block">Smart Materials</h1>
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="flex space-x-4 sm:space-x-6 text-gray-600 font-medium">
            <li><a href="#" className="hover:text-indigo-600 transition-colors duration-200">Home</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors duration-200">About</a></li>
            
              <button onClick={() => "www.google.com"} className="w-full py-2 px-4 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors duration-300">
                Brainware
              </button>
           

          </ul>
        </nav>
      </header>

      {/* Main Content Card */}
      <div>
            <div className="bg-cover bg-center max-w-md w-full p-8 space-y-6 bg-white bg-opacity-80 backdrop-blur-md shadow-xl rounded-2xl text-center">

              {/* Header Section */}
              <div className="flex flex-col items-center">
                <div className="bg-indigo-600 text-white p-4 rounded-full shadow-lg mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open h-8 w-8"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" /></svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Smart Materials</h1>
                <p className="text-gray-500 mt-1">Access your study materials instantly</p>
              </div>

              {/* Input and Buttons Section */}
              <div className="space-y-4">
                <div className="text-left">
                  <label htmlFor="student-id" className="text-gray-700 font-semibold text-lg">Student ID</label>
                  <div className="relative mt-2 rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user h-5 w-5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    </div>
                    <input
                      type="text"
                      id="student-id"
                      name="student-id"
                      className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-150 ease-in-out"
                      placeholder="Enter your student Code"
                      value={studentId}
                      onChange={(e) => {
                        setStudentId(e.target.value);
                        // Clear messages on input change
                        if (message) {
                          setMessage('');
                          setMessageType('');
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="text-left mt-6">
                  <p className="text-gray-700 font-semibold text-lg mb-3">Choose how to receive your materials:</p>
                  <div className="space-y-4">
                    <button
                      onClick={handleSendViaEmail}
                      disabled={isSending}
                      className={`flex items-center justify-center w-full px-4 py-3 text-lg font-medium text-white bg-red-500 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105 ${isSending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'}`}
                    >
                      {isSending && sendingButton === 'gmail' ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading...
                        </div>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail mr-3"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                          Send via Gmail
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleSendViaWhatsApp}
                      disabled={isSending}
                      className={`flex items-center justify-center w-full px-4 py-3 text-lg font-medium text-white bg-green-500 rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105 ${isSending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
                    >
                      {isSending && sendingButton === 'whatsapp' ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading...
                        </div>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square-text mr-3"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 9h8" /><path d="M8 13h6" /></svg>
                          Send via WhatsApp
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Message Section */}
              {message && (
                <div className={`flex items-center justify-center p-3 rounded-lg shadow-sm transition-all duration-300 ease-in-out ${messageType === 'success' ? 'bg-green-100 text-green-700' : (messageType === 'error' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500')}`}>
                  {(messageType === 'success' || messageType === 'error') && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="lucide lucide-check-circle mr-2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
                  )}
                  <p className="font-medium">{message}</p>
                </div>
              )}

              {/* Footer Section */}
              <div className="mt-8 text-center text-gray-400 text-sm">
                <p>Need help? Contact support at <a href="mailto:support@smartmaterials.com" className="text-indigo-600 hover:underline">support@smartmaterials.com</a></p>
              </div>

            </div>

          </div>

      {/* Footer */}
      <footer className="w-full max-w-4xl p-4 mt-8 bg-white bg-opacity-80 backdrop-blur-md shadow-lg rounded-xl text-center">
        <p className="text-gray-500 text-sm font-medium">© 2025 Smart Materials. All rights reserved.</p>
      </footer>
    </div>
  );
}
