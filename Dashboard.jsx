import { useEffect, useState } from "react";

function Dashboard() {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/books")
      .then(res => res.json())
      .then(data => setBooks(data));

    fetch("http://localhost:5000/api/users")
      .then(res => res.json())
      .then(data => setUsers(data));

    fetch("http://localhost:5000/api/transactions")
      .then(res => res.json())
      .then(data => setTransactions(data));
  }, []);

  const totalBooks = books.reduce(
    (total, book) => total + Number(book.quantity),
    0
  );

  const borrowedBooks = transactions
    .filter(transaction => transaction.type === "Borrow")
    .reduce((total, transaction) => total + Number(transaction.quantity), 0)
    -
    transactions
      .filter(transaction => transaction.type === "Return")
      .reduce((total, transaction) => total + Number(transaction.quantity), 0);

  const lowStock = books.filter(book => book.quantity < 2).length;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your library management system.</p>

      <section className="cards">
        <div className="card">
          <h3>Total Books</h3>
          <p>{totalBooks}</p>
        </div>

        <div className="card">
          <h3>Borrowed Books</h3>
          <p>{borrowedBooks}</p>
        </div>

        <div className="card">
          <h3>Registered Users</h3>
          <p>{users.length}</p>
        </div>

        <div className="card">
          <h3>Low Stock</h3>
          <p>{lowStock}</p>
        </div>
      </section>

      <section className="book-section">
        <h2>Recent Books</h2>

        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {books.slice(0, 5).map(book => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.genre}</td>
                <td>{book.quantity}</td>
                <td>
                  {book.quantity === 0
                    ? "Out of Stock"
                    : book.quantity < 2
                    ? "Low Stock"
                    : "Available"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Dashboard;