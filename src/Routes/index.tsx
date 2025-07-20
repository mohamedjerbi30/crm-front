import React from 'react';
import { Routes, Route } from "react-router-dom";

//Layouts
import NonAuthLayout from "../Layouts/NonAuthLayout";
import VerticalLayout from "../Layouts/index";
import AuthProtected from "./AuthProtected"

//routes
import { authProtectedRoutes, publicRoutes } from "./allRoutes";

const Index = () => {
    return (
        <React.Fragment>
            <Routes>
                {/* Public Routes */}
                {publicRoutes.map((route: any, idx: any) => (
                    <Route
                        path={route.path}
                        element={
                            <NonAuthLayout>
                                {route.component}
                            </NonAuthLayout>
                        }
                        key={idx}
                    />
                ))}

                {/* Protected Routes */}
                {authProtectedRoutes.map((route, idx) => (
                    <Route
                        path={route.path}
                        element={
                            <AuthProtected>
                                <VerticalLayout>{route.component}</VerticalLayout>
                            </AuthProtected>
                        }
                        key={idx}
                    />
                ))}
            </Routes>
        </React.Fragment>
    );
};

export default Index;