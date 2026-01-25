import React from 'react';
import { Outlet } from 'react-router';

const Root = () => {
    return (
        <div>
          <h1>This is the root file</h1>
          <Outlet></Outlet>
        </div>
    );
};

export default Root;