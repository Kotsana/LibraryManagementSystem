import { useState, useEffect } from 'react';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookId, setBookId] = useState('');
  const [userId, setUserId] = useState('');
  const [type, setType] = useState('Borrow');
  const [quantity, setQuantity] = useState(1);

  const API = 'http://localhost:5000/api';

  const fetchData = async () => {
    const t = await fetch(`${API}/transactions`);
    const b = await fetch(`${API}/books`);
    const u = await fetch(`${API}/users`);

    setTransactions(await t.json());
    setBooks(await b.json());
    setUsers(await u.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${API}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        book_id: Number(bookId),
        user_id: Number(userId),
        type,
        quantity: Number(quantity)
      })
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.message || result.error || 'Transaction failed');
      return;
    }

    alert('Transaction completed successfully!');
    setBookId('');
    setUserId('');
    setQuantity(1);
    fetchData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction record?')) return;

    const response = await fetch(`${API}/transactions/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      alert('Could not delete transaction');
      return;
    }

    fetchData();
  };

  return (
    <div className="page">
      <h1>Transactions</h1>

      <form onSubmit={handleSubmit}>
        <select value={bookId} onChange={(e) => setBookId(e.target.value)} required>
          <option value="">Select Book</option>
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title} (Stock: {book.quantity})
            </option>
          ))}
        </select>

        <select value={userId} onChange={(e) => setUserId(e.target.value)} required>
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Borrow">Borrow</option>
          <option value="Return">Return</option>
        </select>

        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        <button type="submit">Complete Transaction</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Book</th>
            <th>User</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.book_title}</td>
              <td>{transaction.user_name}</td>
              <td>{transaction.type}</td>
              <td>{transaction.quantity}</td>
              <td>{new Date(transaction.transaction_date).toLocaleString()}</td>
              <td>
                <button onClick={() => handleDelete(transaction.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Transactions;