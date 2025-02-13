import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: "http://192.168.100.179:8080/",
    realm: "resource-manager",
    clientId: "resource-manager"
});

try {
    const authenticated = await keycloak.init();
    if (authenticated) {
        console.log('User is authenticated');
    } else {
        console.log('User is not authenticated');
    }
} catch (error) {
    console.error('Failed to initialize adapter:', error);
}

export default keycloak;