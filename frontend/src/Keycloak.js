import Keycloak from "keycloak-js";

let keycloak = new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_URL,
    realm: import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT,
});

const initKeycloak = async () => {

    try {
        const authenticated = await keycloak.init({
        onLoad: 'login-required', 
        checkLoginIframe: true,
        pkceMethod: 'S256'
        });

        if (authenticated) {
            console.log('User is authenticated');
            return { authenticated, token: keycloak.token };
        } else {

            console.log('User is not authenticated');

        }
    } catch (error) {

        console.error('Failed to initialize adapter:', error);
        
    }
}

const logout = () => {
    keycloak.logout();
};

export {keycloak, initKeycloak, logout};
