type DeviceModelType = {
    productId: string;
    selector: string;
    selectorValues: any;
    source: string;
    upperKey: string;
    deviceId: string;
    message: {
        properties?: any;
        messageType: string;
        inputs?: any[];
        functionId?: string;
    }
}

type DeviceOptionType = {
    name?: string;
    productName?: string;
    propertiesValue?: string;
    propertiesName?: any;
    tagName?: string;
    relationName?: string;
    actionName?: string;
}

