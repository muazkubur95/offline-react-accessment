import React, { useState, useEffect } from 'react';
import { isNameValid, getLocations } from '../mock-api/apis';

function MyForm() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('Canada'); // defaulting to the first option as per your image
  const [locations, setLocations] = useState([]);
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);

  // Fetch location options from mock API
  useEffect(() => {
    const fetchLocations = async () => {
      const locationOptions = await getLocations();
      setLocations(locationOptions);
    };
    
    fetchLocations();
  }, []);

  // Validate name in real-time as the user types
  useEffect(() => {
    let isMounted = true; // Track if the component is mounted
    const validate = async () => {
      try {
        const isValid = await isNameValid(name);
        const nameExists = entries.some((entry) => entry.name === name);
        if (nameExists){
          setError('This name is already in use');
        }
        if (!isValid) {
          setError('Invalid Name');
        }
      } catch (error) {
        if (isMounted) {
          console.error('Validation error:', error);
          setError('An error occurred during name validation.');
        }
      }
    };

    if (name) {
      validate();
    } else {
      setError(null); // Clear the error when name is empty
    }

    return () => {
      isMounted = false; 
    };
  }, [name]);
  
  const handleAdd = async () => {
    console.log(error)
    if (name && !error) {
      // Check if the name is already in the entries array
      const nameExists = entries.some((entry) => entry.name === name);
      // if (!nameExists) {
        setEntries([...entries, { name, location }]);
        setName(''); // Clear the name field
        // setLocation(''); // Clear the location field
      // } else {
        // setError('This name is already in use');
      // }
    }
    // if (!error && name) {
    //   setEntries(entries.concat({ name, location }));
    //   setName(''); // Clear the name field
    // }
  };

  // Clear the form
  const handleClear = () => {
    setName('');
    setLocation('Canada'); // Reset location to default
    setError(null);
  };

  return (
  <div className="form-container">
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {error && <div className="error">{error}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="location">Location:</label>
        <select
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <button type="button" onClick={handleClear}>
          Clear
        </button>
        <button type="button" onClick={handleAdd}>
          Add
        </button>
      </div>
    </form>

    <div className="entries">
      <h3>Entries</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              <td>{entry.name}</td>
              <td>{entry.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
}

export default MyForm;
