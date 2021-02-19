export default function addEdge(params, elements) {
    const { source, target } = params;
    const id = 'edge-' + source + '-' + target;
    //Node path to itself
    if (source === target) {
        return elements;
    }
    //Edge already exists
    if (elements.find((elements) => elements.id === id)) {
        return elements;
    }
    //Source already has an edge (A source node can't link to 2 different pages)
    if (elements.find((elements) => elements.source === source)) {
        return elements;
    }
    const newEdge = {
        id,
        source,
        target,
        arrowHeadType: 'arrowclosed',
        style: { strokeWidth: '5px', arrowWidth: '2px' },
    };
    return elements.concat(newEdge);
}
