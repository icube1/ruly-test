import React, { Suspense, useEffect, useState } from 'react';
import './App.css';
// import { folders, emails } from './data';
import EmailList, { Email } from './components/EmailList';
import FolderList from './components/FolderList';
import Header from './components/Header';
import Footer from './components/Footer';
import useServerApi from './hooks/useServerApi';

// const addEmailHandler = async () => {
//   await fetch('http://localhost:3000/emails', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       from: 'example@example.com',
//       theme: 'Example Theme',
//       message: 'Example Message',
//       folderId: 'exampleFolderId'
//     })
//   })
//     .then(response => response.json())
//     .then(data => console.log(data))
//     .catch(error => console.log(error));
// }
// const addFolderHandler = async () => {
//   await fetch('http://localhost:3000/folders', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       folderName: 'testFolderName'
//     })
//   })
//     .then(response => response.json())
//     .then(data => console.log(data))
//     .catch(error => console.log(error));
// }
// const fetchedEmails = await fetch("http://localhost:3000/emails").then(res => res.json())
// const folders = await fetch("http://localhost:3000/folders").then(res => res.json())
const App: React.FC = () => {
  const {emails: fetchedEmails, folders: fetchedFolders, addEmailHandler, addFolderHandler} = useServerApi();
  const [searchValue, setSearchValue] = useState("");
  const [emails, setEmails] = useState(fetchedEmails);
  const [folders, setFolders] = useState(fetchedFolders)
  console.log(fetchedEmails)

  useEffect(() => {
    if (searchValue) {
      console.log(searchValue)
      // setEmails(
      //   (email) => {

      //   }
      //   ) 
      // setEmails(Object.values(emails).filter((email: Email) => email.theme.includes(searchValue) || email.message.includes(searchValue)))
      // folders.filter(searchValue)
    }else {
        setEmails(fetchedEmails)
      }
  }, [searchValue])
  return (
    <div className='main'>
      <Header />
      <input value={searchValue} onChange={(evt) => setSearchValue(evt.target.value)} />
      <Suspense fallback={<h1>Loading...</h1>}>
      <div className="gmail-container">
        <div className="gmail-container__left-panel">
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <button onClick={addEmailHandler}>add email</button>
            <button onClick={addFolderHandler}>add folder</button>
          </div>
          <FolderList folders={folders} />
        </div>
        <div className="gmail-container__email-list">
          <EmailList emails={emails} />
        </div>
      </div>
      </Suspense>
      <Footer />
    </div>
  );
};

export default App;