import { useState } from 'react';

const useServerApi = async () => {
  // const [emails, setEmails] = useState([]);
  // const [folders, setFolders] = useState([]);
  
  // await fetch("http://localhost:3000/emails").then(res => res.json()).then((data) => setEmails(data)).catch(err=> console.log(err))
  // await fetch("http://localhost:3000/folders").then(res => res.json()).then(data => setFolders(data)).catch(err=> console.log(err))
  const folders = await fetch("http://localhost:3000/folders").then(res => res.json())
  const emails = await fetch("http://localhost:3000/emails").then(res => res.json())
  
  const addEmailHandler = async () => {
    try {
      const response = await fetch('http://localhost:3000/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'example@example.com',
          theme: 'Example Theme',
          message: 'Example Message',
          folderId: 'exampleFolderId'
        })
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const addFolderHandler = async () => {
    try {
      const response = await fetch('http://localhost:3000/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          folderName: 'testFolderName'
        })
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteEmailHandler = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/emails/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  const deleteFolderHandler = () => {

  }

  return {
    emails,
    folders,
    addEmailHandler,
    addFolderHandler,
    deleteEmailHandler,
    deleteFolderHandler,
  };
};

export default useServerApi;