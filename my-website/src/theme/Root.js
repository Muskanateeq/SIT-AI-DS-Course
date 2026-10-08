import React from 'react';

import BookChatbot from '@site/src/components/BookChatbot';

export default function Root({children}) {
  return (
    <>
      {children}
      <BookChatbot />
    </>
  );
}
