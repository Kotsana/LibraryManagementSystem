import { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Student');
  const [editingId, setEditingId] = useState(null);

  const API = 'http://localhost:5000/api/users';

  const fetchUsers = async () => {
    const response = await fetch(API);
    const data = await response.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = { name, email, role };

    if (editingId) {
      await fetch(`${API}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
    } else {
      await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
    }

    clearForm();
    fetchUsers();
  };

  const handleEdit = (user) => {
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setEditingId(user.id);
  };

  const handleDelete = async (id) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  const clearForm = () => {
    setName('');
    setEmail('');
    setRole('Student');
    setEditingId(null);
  };

  return (
    <div className="page">
      <h1>User Management</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Student">Student</option>
          <option value="Admin">Admin</option>
          <option value="Lecturer">Lecturer</option>
        </select>

        <button type="submit">
          {editingId ? 'Update User' : 'Add User'}
        </button>

        {editingId && (
          <button type="button" onClick={clearForm}>
            Cancel
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;