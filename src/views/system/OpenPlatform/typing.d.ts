export interface OpenPlatformItem {
    id: string;
    name: string;
    ownerName?: string;
    status: {
        text: string;
        value: 'enabled' | 'disabled';
    };
    appKey?: string;
    appSecret?: string;
    authorizationTypes: ('api' | 'websocket')[];
    contactPerson?: string;
    callbackUrl?: string;
    description?: string;
}

export interface ApiInfo {
    path: string;
    method: string;
    limit: string;
    needSignature: boolean;
}
