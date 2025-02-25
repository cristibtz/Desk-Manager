import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { KeycloakContext } from '../KeycloakContext';
import Dashboard from '../components/Dashboard/Dashboard';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';
import Landing from '../components/Landing/Landing';
import NavBar from '../components/NavBar/NavBar';

vi.mock('../utils/fetchData/fetchReservations', () => ({
    fetchReservations: vi.fn()
}));

vi.stubGlobal('import.meta', {
    env: {
        VITE_REQUIRED_ROLE: 'Admin'
    }
});

const mockKeycloakContext = (authenticated, role) => ({
    authenticated,
    role,
    logout: vi.fn()
});

describe('ProtectedRoute Component', () => {
    it('should render children when authenticated', () => {
        const mockContextValue = mockKeycloakContext(true, 'user');
        render(
            <KeycloakContext.Provider value={mockContextValue}>
                <MemoryRouter initialEntries={['/dashboard']}>
                    <Routes>
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </MemoryRouter>
            </KeycloakContext.Provider>
        );
        expect(screen.getByText(/Welcome,/i)).toBeInTheDocument();
    });

    it('should redirect to Landing page when not authenticated', async () => {
        const mockContextValue = mockKeycloakContext(false, '');
        render(
            <KeycloakContext.Provider value={mockContextValue}>
                <MemoryRouter initialEntries={['/dashboard']}>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </MemoryRouter>
            </KeycloakContext.Provider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Hello!/i)).toBeInTheDocument();
        });
        expect(screen.queryByText(/Welcome,/i)).not.toBeInTheDocument();
    });
});

describe('NavBar Component', () => {
    it('should render Admin Panel link when user has Admin role', () => {
        const mockContextValue = mockKeycloakContext(true, 'Admin');
        render(
            <KeycloakContext.Provider value={mockContextValue}>
                <NavBar />
            </KeycloakContext.Provider>
        );
        expect(screen.getAllByText(/Admin Panel/i).length).toBeGreaterThan(0);
    });

    it('should not render Admin Panel link when user does not have Admin role', () => {
        const mockContextValue = mockKeycloakContext(true, 'User');
        render(
            <KeycloakContext.Provider value={mockContextValue}>
                <NavBar />
            </KeycloakContext.Provider>
        );
        expect(screen.queryByText(/Admin Panel/i)).not.toBeInTheDocument();
    });

    it('should not render any links when user is not authenticated', () => {
        const mockContextValue = mockKeycloakContext(false, '');
        render(
            <KeycloakContext.Provider value={mockContextValue}>
                <NavBar />
            </KeycloakContext.Provider>
        );
        expect(screen.queryByText(/Dashboard/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Occupied desks/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Admin Panel/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Logout/i)).not.toBeInTheDocument();
    });
});
