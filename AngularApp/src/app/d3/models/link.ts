import { Node } from './node';
import * as d3Force from 'd3-force';

// Implementing SimulationLinkDatum interface into our custom Link class
export class Link implements d3Force.SimulationLinkDatum<Node> {
    // Optional - defining optional implementation properties - required for relevant typing assistance
    index?: number;

    // Must - defining enforced implementation properties
    source: Node | string | number;
    target: Node | string | number;

    constructor(source, target) {
        this.source = source;
        this.target = target;
    }
}
