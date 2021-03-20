export default function initializeElements(componentData) {
    switch (componentData.PAGE_TYPE) {
        case 'I':
            return {
                id: componentData.PAGE,
                type: 'introNode',
                data: { label: componentData.PAGE_TITLE },
                style: {
                    border: '3px solid orange',
                    borderRadius: '5%',
                    padding: 10,
                },
                position: {
                    x: componentData.X_COORDINATE,
                    y: componentData.Y_COORDINATE,
                },
                ...componentData,
            };
        case 'A':
            return {
                id: componentData.PAGE,
                type: 'actionNode',
                data: { label: componentData.PAGE_TITLE },
                style: {
                    border: '3px solid green',
                    borderRadius: '5%',
                    padding: 10,
                },
                position: {
                    x: componentData.X_COORDINATE,
                    y: componentData.Y_COORDINATE,
                },
                ...componentData,
            };
        case 'G':
            return {
                id: componentData.PAGE,
                type: 'genericNode',
                data: { label: componentData.PAGE_TITLE },
                style: {
                    border: '3px solid red',
                    borderRadius: '5%',
                    padding: 10,
                },
                position: {
                    x: componentData.X_COORDINATE,
                    y: componentData.Y_COORDINATE,
                },
                ...componentData,
            };
        case 'R':
            return {
                id: componentData.PAGE,
                type: 'reflectionNode',
                data: { label: componentData.PAGE_TITLE },
                style: {
                    border: '3px solid purple',
                    borderRadius: '5%',
                    padding: 10,
                },
                position: {
                    x: componentData.X_COORDINATE,
                    y: componentData.Y_COORDINATE,
                },
                ...componentData,
            };
        case 'S':
            return {
                id: componentData.PAGE,
                type: 'conversationNode',
                data: { label: componentData.PAGE_TITLE },
                style: {
                    border: '3px solid blue',
                    borderRadius: '5%',
                    padding: 10,
                },
                position: {
                    x: componentData.X_COORDINATE,
                    y: componentData.Y_COORDINATE,
                },
                ...componentData,
            };
        default:
            return {
                id: componentData.PAGE,
                type: 'conversationNode',
                data: { label: componentData.PAGE_TITLE },
                style: {
                    border: '3px solid blue',
                    borderRadius: '5%',
                    padding: 10,
                },
                position: {
                    x: componentData.X_COORDINATE,
                    y: componentData.Y_COORDINATE,
                },
                ...componentData,
            };
    }
}
