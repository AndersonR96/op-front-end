import { useState, useEffect } from "react";
import "./App.css";

const Form = () => {
  const [item, setItem] = useState({ name: "" });
  const [items, setItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? import.meta.env.VITE_API_URL + items[editIndex].id
      : import.meta.env.VITE_API_URL;

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    })
      .then((response) => response.json())
      .then((newItem) => {
        if (isEditing) {
          const updatedItems = items.map((el, index) =>
            index === editIndex ? newItem : el
          );
          setItems(updatedItems);
          setIsEditing(false);
          setEditIndex(null);
        } else {
          setItems([...items, newItem]);
        }
        setItem({ name: "" });
      })
      .catch((error) =>
        console.error("Error al agregar/actualizar el item:", error)
      );
  };

  const handleEdit = (index) => {
    setIsEditing(true);
    setEditIndex(index);
    setItem(items[index]);
  };

  const handleDelete = (index) => {
    const itemId = items[index].id;

    fetch(import.meta.env.VITE_API_URL + itemId, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setItems(items.filter((_, i) => i !== index));
      })
      .catch((error) => console.error("Error al eliminar el item:", error));
  };

  const handleReset = () => {
    setItem({ name: "" });
    setIsEditing(false);
    setEditIndex(null);
  };

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setItems(data))
      .catch((error) => console.error("Error al obtener los items:", error));
  }, []);

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={item.name}
          onChange={handleInputChange}
          placeholder="Nombre"
          required
          className="centered-input"
        />
        <button type="submit">{isEditing ? "Actualizar" : "Agregar"}</button>
        <button type="button" onClick={handleReset} disabled={!item.name}>Cancelar</button>
      </form>

      <ul className="item-list">
        {items.map((el, index) => (
          <li key={index} className="item">
            <span className="item-name">{el.name}</span>{" "}
            <div className="button-container">
              <button onClick={() => handleEdit(index)}>Editar</button>
              <button onClick={() => handleDelete(index)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Form;
