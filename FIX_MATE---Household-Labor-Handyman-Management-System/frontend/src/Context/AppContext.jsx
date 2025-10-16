/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import React, { createContext, useEffect, useState, useCallback } from "react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);
 
    const getUserData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setUserData(null);
                setIsLoggedin(false);
                return;
            }

            const { data } = await axios.get(backendUrl + '/api/user/data', { 
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (data.success) {
                if (data.userData && data.userData._id) {
                    setUserData(data.userData);
                    setIsLoggedin(true);
                } else {
                    setUserData(null);
                    setIsLoggedin(false);
                }
            } else {
                setUserData(null);
                setIsLoggedin(false);
            }
        } catch (error) {
            if (error?.response?.status === 401) {
                setUserData(null);
                setIsLoggedin(false);
                localStorage.removeItem('token');
            } else {
                // console.debug('getUserData error:', error?.message || error);
            }
        }
    }, [backendUrl]);

    const getAuthState = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsLoggedin(false);
                setUserData(null);
                return;
            }

            const { data } = await axios.get(backendUrl + '/api/auth/is-auth', { 
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (data.success) {
                setIsLoggedin(true);
                getUserData();
            } else {
                // Not authenticated: silently clear state
                setIsLoggedin(false);
                setUserData(null);
                localStorage.removeItem('token');
            }
        } catch (error) {
            // Suppress toast on 401 to avoid noisy popups on reload
            setIsLoggedin(false);
            setUserData(null);
            if (error?.response?.status === 401) {
                localStorage.removeItem('token');
            }
        }
    }, [backendUrl, getUserData]);

    useEffect(() => {
        getAuthState();
    }, [getAuthState]);

    // getUserData wrapped above



    const value = {
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
    
        getUserData,
       
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};