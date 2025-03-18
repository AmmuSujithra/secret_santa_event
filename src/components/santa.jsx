import { useState } from "react";
import * as Papa from "papaparse";

const Santa = () => {
  const [employees, setEmployees] = useState([]);
  const [assignments, setAssignments] = useState({});

  // Handle CSV file upload
  const handleEmployeeUpload = (e) => {
    const file = e.target.files[0];

    if (!file) {
      alert("❌ Please select a CSV file.");
      return;
    }

    // Ensure the file is a CSV
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      alert("❌ Only CSV files are allowed.");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      encoding: "UTF-8",
      complete: (result) => {
        console.log("CSV Parsed Data:", result.data); // Debugging

        if (!result.data || result.data.length === 0) {
          alert("❌ CSV file is empty or incorrectly formatted.");
          return;
        }

        // Ensure employees are uniquely identified by email
        const employeesList = result.data
          .filter((row) => row.Employee_Name && row.Employee_EmailID)
          .map((row, index) => ({
            id: index, // Unique ID for pairing
            name: row.Employee_Name.trim(),
            email: row.Employee_EmailID.trim(),
          }));

        if (employeesList.length < 2) {
          alert("❌ Need at least 2 employees to assign Secret Santa.");
          return;
        }

        console.log("Final Employee List:", employeesList);
        setEmployees(employeesList);
      },
      error: (error) => {
        console.error("CSV Parsing Error:", error.message);
        alert("❌ Error parsing CSV file. Check the file format.");
      },
    });
  };

  // Fisher-Yates Shuffle Algorithm for fair randomization
  const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Generate Secret Santa Pairings
  const handleClick = () => {
    if (employees.length === 0) {
      alert("❌ Please upload a valid employee list before generating pairs.");
      return;
    }

    let shuffled = shuffleArray([...employees]);

    // Ensure no one gets themselves
    let valid = false;
    while (!valid) {
      valid = true;
      for (let i = 0; i < shuffled.length; i++) {
        if (shuffled[i].email === employees[i].email) {
          valid = false;
          shuffled = shuffleArray([...employees]); // Reshuffle
          break;
        }
      }
    }

    // Create assignments by email
    let newAssignments = {};
    for (let i = 0; i < employees.length; i++) {
      newAssignments[employees[i].email] = {
        santaName: employees[i].name,
        santaEmail: employees[i].email,
        childName: shuffled[i].name,
        childEmail: shuffled[i].email,
      };
    }

    console.log("Final Assignments:", newAssignments);
    setAssignments(newAssignments);
  };

  // CSV Download
  const handleDownloadCSV = () => {
    if (Object.keys(assignments).length === 0) {
      alert("No assignments to download. Generate assignments first!");
      return;
    }

    const csvData = Object.values(assignments).map((entry) => ({
      "Employee Name": entry.santaName,
      "Employee Email": entry.santaEmail,
      "Secret Child Name": entry.childName,
      "Secret Child Email": entry.childEmail,
    }));

    const csvString = Papa.unparse(csvData);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "secret_santa_assignments.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="container">
      <h1>Secret Santa Generator</h1>

      {/* Upload CSV */}
      <div className="mb-3">
        <label htmlFor="formFile" className="form-label">
          Upload CSV File
        </label>
        <input
          className="form-control"
          type="file"
          id="formFile"
          accept=".csv"
          onChange={handleEmployeeUpload}
        />
      </div>

      {/* Generate Pairs Button */}
      <div>
        <button className="btn btn-success mt-2" onClick={handleClick}>
          Generate
        </button>
      </div>

      {/* Display Assignments */}
      {assignments && Object.keys(assignments).length > 0 && (
        <div className="mt-4 p-4 border rounded-md bg-gray-100">
          <h3 className="font-semibold">Secret Santa Pairings</h3>
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>S.No</th>
                <th>Employee Name</th>
                <th>Employee Email</th>
                <th>Secret Child Name</th>
                <th>Secret Child Email</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(assignments).map((pair, index) => (
                <tr key={pair.santaEmail}>
                  <td className="text-start">{index + 1}</td>
                  <td className="text-start">{pair.santaName}</td>
                  <td className="text-start">{pair.santaEmail}</td>
                  <td className="text-start">{pair.childName}</td>
                  <td className="text-start">{pair.childEmail}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Download CSV */}
          <button className="btn btn-warning mt-2" onClick={handleDownloadCSV}>
            Download
          </button>
        </div>
      )}
    </div>
  );
};

export default Santa;
