import React from 'react';

const Alert = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-yellow-100 border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
      {children}
    </div>
  );
};

const AlertDescription = ({ children }: { children: React.ReactNode }) => {
  return (
    <p>
      {children}
    </p>
  );
};


export { Alert, AlertDescription };