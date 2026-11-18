import { useState, useEffect } from 'react';

function Books() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [isbn, setIsbn] = useState('');
  const [quantity, setQuantity] = useState('');
  const [editingId, setEditingId] = useState(null);

  const API = 'http://localhost:5000/api/books';

  // Load books from database
  const fetchBooks = async () => {
    const response = await fetch(API);
    const data = await response.json();
    setBooks(data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Add or update book
  const handleSubmit = async (e) => {
    e.preventDefault();

    const book = {
      title,
      author,
      genre,
      isbn,
      quantity: Number(quantity)
    };

    if (editingId) {
      await fetch(`${API}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
      });
    } else {
      await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
      });
    }

    clearForm();
    fetchBooks();
  };

  // Delete book
  const handleDelete = async (id) => {
    await fetch(`${API}/${id}`, {
      method: 'DELETE'
    });

    fetchBooks();
  };

  // Edit book
  const handleEdit = (book) => {
    setTitle(book.title);
    setAuthor(book.author);
    setGenre(book.genre || '');
    setIsbn(book.isbn || '');
    setQuantity(book.quantity);
    setEditingId(book.id);
  };

  // Clear form
  const clearForm = () => {
    setTitle('');
    setAuthor('');
    setGenre('');
    setIsbn('');
    setQuantity('');
    setEditingId(null);
  };

  return (
    <div className="page">
      <h1>Book Management</h1>

      <form onSubmit={handleSubmit}>
        <input placeholder="Book Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
        <input placeholder="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} />
        <input placeholder="ISBN" value={isbn} onChange={(e) => setIsbn(e.target.value)} />
        <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />

        <button type="submit">{editingId ? 'Update Book' : 'Add Book'}</button>

        {editingId && (
          <button type="button" onClick={clearForm}>
            Cancel
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>ISBN</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.genre}</td>
              <td>{book.isbn}</td>
              <td>{book.quantity}</td>
              <td>
                <button onClick={() => handleEdit(book)}>Edit</button>
                <button onClick={() => handleDelete(book.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Books;