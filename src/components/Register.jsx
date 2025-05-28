import { useState } from 'react';
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      username: form.username,
      password: form.password,
      //member: {
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
      //}
    };
    console.log('Payload:', payload);

    await axios.post('http://localhost:8080/api/auth/register', payload);
    //await axios.post('http://localhost:8080/api/members', payload);

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
      </div>

      <div>
        <label>Password:</label>&nbsp;&nbsp;
        <input name="password" type="password" value={form.password} onChange={handleChange} required />
      </div>

      <div>
        <label>Full Name:</label>&nbsp;&nbsp;
        <input name="name" value={form.name} onChange={handleChange} required />
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
