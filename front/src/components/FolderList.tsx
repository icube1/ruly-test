import React from 'react';

interface Folder {
  id: string;
  folderName: string;
}

interface FolderListProps {
  folders: Folder[];
}

const FolderList: React.FC<FolderListProps> = ({ folders }) => {
  return (
    <div className="folder-list">
      <ul className="folder-list__list">
        <li key={'defaultFolder'} className='folder-list__item'>Входящие</li>
        {folders.map((folder: Folder) => (
          <li key={folder.id} className="folder-list__item">
            {folder.folderName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FolderList;