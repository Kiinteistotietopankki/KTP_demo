import React, { useEffect, useState } from 'react'

export default function EditModal({ value, name , onSave }) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue(value); // Set initial value when modal is shown
  }, [value]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSave = () => {
    onSave(inputValue); // Call parent with updated value
  };

  return (
    <div className="modal fade" id="editModal" tabIndex="-1" role="dialog" aria-labelledby="editModalTitle" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="editModalLongTitle">{name}</h5>
            <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              className="form-control"
              value={inputValue}
              onChange={handleChange}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
              onClick={handleSave}
            >
              Tallenna
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
