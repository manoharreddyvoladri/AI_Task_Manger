import React from 'react';

const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="border rounded-md p-4">
      {children}
    </div>
  );
};

const CardHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="font-semibold">
      {children}
    </div>
  );
};

const CardTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <h2 className="text-xl font-bold">
      {children}
    </h2>
  );
};

const CardContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardContent };