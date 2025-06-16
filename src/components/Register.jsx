import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation to login
import './Register.css'; // Import the new CSS file

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: '',
        password: '',
        name: '',
        address: '',
        contactInfo: '',
        // registrationDate will be set by backend, membershipExpiryDate too
        email: '',
        nric: '',
        mobile: '',
        remark: '',
        birthday: '',
        sex: ''
    });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState(null); // For backend submission errors
    const [successMessage, setSuccessMessage] = useState(null); // For successful registration

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        // Clear a specific error message as the user types
        if (errors[e.target.name]) {
            setErrors(prev => ({ ...prev, [e.target.name]: undefined }));
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!form.username.trim()) {
            newErrors.username = 'Username is required';
            isValid = false;
        }
        if (form.password.length < 6) { // Changed to 6 as in your remarks, consistent with other forms
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }
        if (!form.name.trim()) {
            newErrors.name = 'Full Name is required';
            isValid = false;
        }
        if (!form.contactInfo.trim()) { // Added validation for contactInfo as it's often required
            newErrors.contactInfo = 'Contact Info is required';
            isValid = false;
        }
        if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
            newErrors.email = 'Valid email format is required';
            isValid = false;
        }
        if (!form.sex) { // Added validation for sex
            newErrors.sex = 'Sex is required';
            isValid = false;
        }


        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null); // Clear previous submission error
        setSuccessMessage(null); // Clear previous success message

        if (!validateForm()) {
            return;
        }

        try {
            const payload = {
                username: form.username,
                password: form.password,
                name: form.name,
                address: form.address,
                contactInfo: form.contactInfo,
                // registrationDate & membershipExpiryDate are handled by backend
                email: form.email,
                nric: form.nric,
                mobile: form.mobile,
                remark: form.remark,
                birthday: form.birthday, // Backend expects YYYY-MM-DD
                sex: form.sex
            };
            console.log('Registration Payload:', payload);

            await axios.post('http://localhost:8080/api/auth/register', payload);
            setSuccessMessage('Registration successful! You can now log in.');
            // Optionally clear the form after success, or leave it for user to review
            setForm({
                username: '',
                password: '',
                name: '',
                address: '',
                contactInfo: '',
                email: '',
                nric: '',
                mobile: '',
                remark: '',
                birthday: '',
                sex: ''
            });
            // navigate('/login'); // Redirect after a short delay so user can read success message
            setTimeout(() => {
                 navigate('/login');
            }, 2000); // Redirect after 2 seconds
        } catch (error) {
            console.error('Registration error:', error.response?.data || error);
            setSubmitError(error.response?.data || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <h2>Register New Member</h2>
            {submitError && <p className="error-message">{submitError}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            <form onSubmit={handleSubmit} className="register-form">
                {/* Account Details Section */}
                <div className="form-section">
                    <h3>Account Details</h3>
                    <div className="form-row">
                        <label htmlFor="username">Username<span className="required">*</span>:</label>
                        <input type="text" id="username" name="username" value={form.username} onChange={handleChange} />
                        {errors.username && <span className="error-text">{errors.username}</span>}
                    </div>

                    <div className="form-row">
                        <label htmlFor="password">Password<span className="required">*</span>:</label>
                        <input type="password" id="password" name="password" value={form.password} onChange={handleChange} />
                        {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>
                </div>

                {/* Personal Details Section */}
                <div className="form-section">
                    <h3>Personal Details</h3>
                    <div className="form-row">
                        <label htmlFor="name">Full Name<span className="required">*</span>:</label>
                        <input type="text" id="name" name="name" value={form.name} onChange={handleChange} />
                        {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>

                    <div className="form-row">
                        <label htmlFor="email">Email<span className="required">*</span>:</label>
                        <input type="email" id="email" name="email" value={form.email} onChange={handleChange} />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    <div className="form-row">
                        <label htmlFor="contactInfo">Contact Info<span className="required">*</span>:</label>
                        <input type="text" id="contactInfo" name="contactInfo" value={form.contactInfo} onChange={handleChange} />
                        {errors.contactInfo && <span className="error-text">{errors.contactInfo}</span>}
                    </div>

                    <div className="form-row">
                        <label htmlFor="mobile">Mobile Number:</label>
                        <input type="text" id="mobile" name="mobile" value={form.mobile} onChange={handleChange} />
                    </div>

                    <div className="form-row">
                        <label htmlFor="address">Address:</label>
                        <textarea id="address" name="address" rows="2" value={form.address} onChange={handleChange}></textarea>
                    </div>

                    <div className="form-row">
                        <label htmlFor="nric">NRIC:</label>
                        <input type="text" id="nric" name="nric" value={form.nric} onChange={handleChange} />
                    </div>

                    <div className="form-row">
                        <label htmlFor="birthday">Birthday:</label>
                        <input type="date" id="birthday" name="birthday" value={form.birthday} onChange={handleChange} />
                    </div>

                    <div className="form-row">
                        <label htmlFor="sex">Sex<span className="required">*</span>:</label>
                        <select id="sex" name="sex" value={form.sex} onChange={handleChange}>
                            <option value="">Select Sex</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option> {/* Added 'Other' option for completeness */}
                        </select>
                        {errors.sex && <span className="error-text">{errors.sex}</span>}
                    </div>

                    <div className="form-row">
                        <label htmlFor="remark">Remark:</label>
                        <input type="text" id="remark" name="remark" value={form.remark} onChange={handleChange} />
                    </div>
                </div>

                <button type="submit" className="register-button">Register</button>
            </form>

            <p className="login-prompt">
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
};

export default Register;