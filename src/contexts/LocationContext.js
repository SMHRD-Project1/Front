import React, { createContext, useContext, useState } from 'react';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [polygonCoords, setPolygonCoords] = useState([]);

    return (
        <LocationContext.Provider value={{ polygonCoords, setPolygonCoords }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => useContext(LocationContext);

