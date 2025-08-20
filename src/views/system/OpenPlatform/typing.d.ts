export interface OpenPlatformItem {
    id: string;
    name: string;
    ownerName?: string;
    state: {
        text: string;
        value: 'enabled' | 'disabled';
    };
    appKey?: string;
    appSecret?: string;
    authType: ('api' | 'websocket')[];
    callbackUrl?: string;
    deviceAccess?: {
        mode: 'blacklist' | 'whitelist';
        rules: any[]; // Replace with specific rule type
    };
    apiConfig?: {
        apis: any[]; // Replace with specific API config type
    }
}

export interface ApiInfo {
    path: string;
    method: string;
    limit: string;
    needSignature: boolean;
}
