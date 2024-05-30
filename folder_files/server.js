// Imports the Express module, which is a web application framework for Node.js
const express = require("express");

// Imports the fs-extra module, which adds file system methods that aren't included in the native fs module and adds promise support
const fs = require("fs-extra");

// Imports the path module, which provides utilities for working with file and directory paths
const path = require("path");


// Creates an Express application
const app = express();


// Defines the port number that the server will listen on
const PORT = 3000;

// Creates the full path for the folder named 'Sample' in the current directory
const folderPathName = path.join(__dirname, "Sample");

// Checks if the folder 'Sample' exists, and if not, creates it
if (!fs.existsSync(folderPathName)) {
    fs.mkdirSync(folderPathName);
}


// Defines a function to generate a formatted file name using the current date and time, replacing colons with hyphens to make it suitable for file names
function getFormattedFileName() {
    return new Date().toISOString().replace(/:/g, "-");
}

// Adds middleware to parse incoming JSON requests
app.use(express.json());

// Handles POST requests to the /createFolderAndFile endpoint
app.post("/createFolderAndFile", async (req, res) => {
    try {

        await fs.ensureDir(folderPathName);

        // Generates a file name using the utility function with the current date and time
        const fileName = `${getFormattedFileName()}.txt`;

        // Constructs the full path for the new file inside the 'Sample' folder
        const filePath = path.join(folderPathName, fileName);

        // Defines the content of the file as the current date and time
        const content = new Date().toString();

        // Writes the content to the file asynchronously
        await fs.writeFile(filePath, content);

        // Sends a success response to the client
        res.send("Folder and file created successfully");

    } catch (error) {
        // Logs any errors that occur
        console.error("Error occurred:", error);

        // Sends a 500 Internal Server Error response to the client if an error occurs
        res.status(500).send("Error writing in the file");

    }
});

// Endpoints retrieve all the text files
app.get("/getCreatedFiles", async (req, res) => {
    try {
        // Ensure the directory exists, if not, create it
        await fs.ensureDir(folderPathName);

        // Read all files in the folder
        const files = await fs.readdir(folderPathName);

        // Filter out only text files
        const textFiles = files.filter((file) => file.endsWith(".txt"));

        // Send the list of text files as a JSON response
        res.json(textFiles);

    } catch (error) {
        // Logs any errors that occur
        console.error("Error occurred:", error);

        // Sends a 500 Internal Server Error response to the client if an error occurs
        res.status(500).send("Error reading folder - ", error);
    }
});


// Starts the server and listens for connections on the specified port, logging a message to the console when the server is running
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
