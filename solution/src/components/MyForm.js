import React, { useState, useEffect } from 'react';
import { isNameValid, getLocations } from '../mock-api/apis';

function MyForm() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('Canada'); // defaulting to the first option to Canada
  const [locations, setLocations] = useState([]);
  // Entries are stored in the local state to allow for efficient access and manipulation.
// This reduces unnecessary API calls and potential latency.
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);

  // Fetch location options from mock API
  // Asynchronous API calls ensure the UI doesn't freeze or become unresponsive
  // during data fetching or validation. This leads to a smoother user experience
  useEffect(() => {
    const fetchLocations = async () => {
      const locationOptions = await getLocations();
      setLocations(locationOptions);
    };
    
    fetchLocations();
  }, []);

  // Validate name in real-time as the user types
  // This effect is used for real-time validation. It enhances user experience by
// providing immediate feedback on the availability of the name.
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
      // Error handling is crucial for a good user experience. Users are informed of
      // any issues immediately, which builds trust and allows them to take corrective
      // action if necessary.
      setError(null); // Clear the error when name is empty
    }

    return () => {
      isMounted = false; 
    };
  }, [name]);

  // Client-side deduplication prevents unnecessary state updates and re-renders,
  // improving the efficiency of the app.
  const handleAdd = async () => {
    console.log(error)
    if (name && !error) {
      // Check if the name is already in the entries array
      const nameExists = entries.some((entry) => entry.name === name);

        setEntries([...entries, { name, location }]);
        setName(''); // Clear the name field

    }

  };

  // Clear the form
  // Clear functionality enhances user experience by providing an easy way to
  // reset the form. This is particularly useful if the user wants to quickly
// start over without manually clearing each field.
  const handleClear = () => {
    setName('');
    setLocation('Canada'); // Reset location to default
    setError(null);
  };
  // Preventing default form submission avoids a full page reload, which can
  // disrupt the user's workflow and waste bandwidth.

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
