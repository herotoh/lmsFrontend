import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: '',
        password: '',
        name: '',
        address: '',
        contactInfo: '',
        registrationDate: '',
        membershipExpiryDate: '',
        email: '',
        nric: '',
        mobile: '',
        remark: '',
        birthday: '',
        sex: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!form.username.trim()) {
            newErrors.username = 'Username is required';
            isValid = false;
        }
        if (form.password.length < 2) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }
        if (!form.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }
        if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
            newErrors.email = 'Invalid email format';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                registrationDate: form.registrationDate || new Date().toISOString().split("T")[0],
                membershipExpiryDate: form.membershipExpiryDate || null,
                email: form.email,
                nric: form.nric,
                mobile: form.mobile,
                remark: form.remark,
                birthday: form.birthday,
                sex: form.sex
            };
            console.log('Payload:', payload);

            await axios.post('http://localhost:8080/api/auth/register', payload);
            alert('Registration successful!');
            navigate('/login');
        } catch (error) {
            console.error(error.response?.data || error);
            alert('Registration failed.');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h2>Register</h2>

            <div>
                <label>Username:</label>&nbsp;&nbsp;
                <input name="username" value={form.username} onChange={handleChange} required />
                {errors.username && <span style={{ color: 'red' }}>{errors.username}</span>}
            </div>

            <div>
                <label>Password:</label>&nbsp;&nbsp;
                <input name="password" type="password" value={form.password} onChange={handleChange} required />
                {errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}
            </div>

            <div>
                <label>Full Name:</label>&nbsp;&nbsp;
                <input name="name" value={form.name} onChange={handleChange} required />
                {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
            </div>

            <div>
                <label>Address:</label>&nbsp;&nbsp;
                <input name="address" value={form.address} onChange={handleChange} />
            </div>

            <div>
                <label>Contact Info:</label>&nbsp;&nbsp;
                <input name="contactInfo" value={form.contactInfo} onChange={handleChange} required />
            </div>

            <div>
                <label>Email:</label>&nbsp;&nbsp;
                <input name="email" type="email" value={form.email} onChange={handleChange} required />
                {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
            </div>

            <div>
                <label>NRIC:</label>&nbsp;&nbsp;
                <input name="nric" value={form.nric} onChange={handleChange} />
            </div>

            <div>
                <label>Mobile Number:</label>&nbsp;&nbsp;
                <input name="mobile" value={form.mobile} onChange={handleChange} />
            </div>

            <div>
                <label>Remark:</label>&nbsp;&nbsp;
                <input name="remark" value={form.remark} onChange={handleChange} />
            </div>

            <div>
                <label>Birthday:</label>&nbsp;&nbsp;
                <input name="birthday" type="date" value={form.birthday} onChange={handleChange} />
            </div>

            <div>
                <label>Sex:</label>&nbsp;&nbsp;
                <select name="sex" value={form.sex} onChange={handleChange} required>
                    <option value="">Select Sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>

            <br />
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;