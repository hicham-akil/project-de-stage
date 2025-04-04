import React, { useState } from 'react';
import axios from 'axios';
// This React component allows users to create a project by filling out a form with a title, description, and a file upload.
// It uses Axios to send the form data, including the file, to a backend API with authentication via a token.
// The component also handles loading, error states, and form resetting upon successful submission.

const CreateProject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null,
  });

  const token = localStorage.getItem("token");

  if (!token) {
    return <div className="text-red-500 text-center font-semibold">Error: You are not logged in. Please log in first.</div>;
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      console.log("Selected file:", files[0]); // Debugging
      setFormData((prevState) => ({ ...prevState, [name]: files[0] }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { title, description, file } = formData;

    const formDataToSend = new FormData();
    formDataToSend.append('title', title);
    formDataToSend.append('description', description);
    formDataToSend.append('file', file);

    // Debugging: Check FormData before sending
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/create', formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        },
      });

      // Reset form data on successful submission
      setFormData({ title: "", description: "", file: null });

      setLoading(false);
      setError(null);
    } catch (error) {
      setError('An error occurred while creating the project.');
      console.error("Upload Error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Project</h2>
      
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter project title"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter project description"
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Choose File</label>
          <input
            type="file"
            name="file"
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-300"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
