import Keycloak from "keycloak-js";


let keycloak = new Keycloak({
    url: 'http://192.168.100.179:8080/',
    realm: 'resource-manager',
    clientId: 'resource-manager',
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
            return authenticated;
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