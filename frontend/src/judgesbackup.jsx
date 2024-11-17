// Judges.jsx
import { useState } from "react";
import "./judges.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPenToSquare,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

function Judges() {
  const [showModal, setShowModal] = useState(false);
  const [rows, setRows] = useState([]);
  const [newRow, setNewRow] = useState({
    idNo: "",
    name: "",
    email: "",
    status: "Assigned", // default value
  });

  // Handle input changes for the modal form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prevRow) => ({
      ...prevRow,
      [name]: value,
    }));
  };

  // Add a new row or update an existing one
  const handleAddRow = () => {
    setRows((prevRows) => [...prevRows, newRow]);
    setShowModal(false); // Close modal after adding
    setNewRow({
      idNo: "",
      name: "",
      email: "",
      status: "Assigned", //reset to default
    });
  };

  // Delete a row
  const handleDeleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  // Edit an existing row
  const handleEditRow = (index) => {
    setNewRow(rows[index]);
    setRows(rows.filter((_, i) => i !== index)); // Temporarily remove row to avoid duplication
    setShowModal(true);
  };

  return (
    <div>
      {/* Table */}
      <div className="table-wrapperr">
        <table className="judge-table">
          <thead>
            <tr>
              <th>ID NO</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>{row.idNo}</td>
                <td>{row.name}</td>
                <td>{row.email}</td>
                <td>
                  <select
                    value={row.status}
                    onChange={(e) => {
                      const updatedRows = [...rows];
                      updatedRows[index].status = e.target.value;
                      setRows(updatedRows);
                    }}
                  >
                    <option value="Assigned">Assigned</option>
                    <option value="Unassigned">Unassigned</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </td>
                <td>
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    className="icon"
                    cursor="pointer"
                    onClick={() => handleEditRow(index)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="icon"
                    cursor="pointer"
                    onClick={() => handleDeleteRow(index)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Judge Button */}
      <button className="add-judge-buttonn" onClick={() => setShowModal(true)}>
        <FontAwesomeIcon icon={faPlus} />
        Add Judge
      </button>

      {/* Modal */}
      {showModal && (
        <div className="modall">
          <div className="modal-contentt">
            <span className="close-buttonn" onClick={() => setShowModal(false)}>
              <FontAwesomeIcon icon={faXmark} />
            </span>
            <h2 className="form-titlee">
              {newRow.name ? "Edit Judge" : "Add Judge"}
            </h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-fieldd">
                <label>
                  ID NO:
                  <input
                    type="text"
                    name="idNo"
                    value={newRow.idNo}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>
              <div className="form-fieldd">
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={newRow.name}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>
              <div className="form-fieldd">
                <label>
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={newRow.email}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>
              <div className="form-fieldd">
                <label>Status:</label>
                <select
                  name="status"
                  value={newRow.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Assigned">Assigned</option>
                  <option value="Unassigned">Unassigned</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleAddRow}
                className="submit-buttonn"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Judges;
