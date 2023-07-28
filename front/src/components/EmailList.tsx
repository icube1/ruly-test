import React from 'react';
// import '../App.css'
export interface Email {
    id: string;
    from: string;
    theme: string;
    message: string;
    opened:string;
    sentAt: string;
    folderId: string;
}

interface EmailListProps {
  emails: Email[];
}

const EmailList: React.FC<EmailListProps> = ({ emails }) => {
  function deleteMessage(id: string): void {
    
  }

  return (
    <div className="email-list">
      {emails.map((email: Email) => (
        <div onClick={()=>{}} key={email.id} className="email-list__item">
          <div className="email-list__sender">{email.from}</div>
          <div className="email-list__subject">{email.theme}</div>
          <div className="email-list__date">{email.message}</div>
          <button onClick={()=>deleteMessage(email.id)}>Удалить сообщение</button>
        </div>
      ))}
    </div>
  );
};

export default EmailList;