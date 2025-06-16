import React, { useState } from 'react'; // Import useState
import './Contact.css'; // Import the CSS for styling

const Contact = () => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission to handle it with JavaScript

    const { name, email, subject, message } = formData;
    const recipientEmail = 'support@ntuclearning.com'; // The target email address

    // Encode subject and body for URL
    const encodedSubject = encodeURIComponent(`Contact Form: ${subject}`);
    const encodedBody = encodeURIComponent(
      `Name: ${name}\n` +
      `Email: ${email}\n\n` +
      `Message:\n${message}`
    );

    // Construct the mailto URL
    const mailtoLink = `mailto:${recipientEmail}?subject=${encodedSubject}&body=${encodedBody}`;

    // Open the user's default email client
    window.location.href = mailtoLink;

    // Optionally, clear the form after submission attempt
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });

    // Provide feedback to the user
    alert("An email draft has been opened in your default email client. Please send it from there!");
  };

  return (
    <div className="contact-container">
      <h2>Contact Us</h2>
      <p>If you have any questions, feedback, or inquiries, please feel free to reach out to us using the information below:</p>

      <div className="contact-info">
        <p><strong>Email:</strong> <a href="mailto:support@ntuclearning.com">support@ntuclearning.com</a></p>
        <p><strong>Phone:</strong> +65 8888 8888 </p>
        <p><strong>Address:</strong> 888 Jalan Heng Ong Huat Singapore 888888 </p>
      </div>

      <div className="contact-form-section">
        <h3>Send Us a Message</h3>
        <form className="contact-form" onSubmit={handleSubmit}> {/* Add onSubmit handler */}
          <div className="form-group">
            <label htmlFor="name">Your Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name} // Controlled component
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Your Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email} // Controlled component
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject} // Controlled component
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={formData.message} // Controlled component
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit" className="submit-button">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
