import { EventEmitter } from '@angular/core';
import { Node } from '../../d3/models/node';
import { Link } from '../../d3/models/link';
import * as d3 from 'd3';
import * as d3Force from 'd3-force';

const FORCES = {
    LINKS: 1 / 50,
    COLLISION: 1,
    CHARGE: -30 // default
};

export class ForceDirectedGraph {
    public ticker: EventEmitter<d3Force.Simulation<Node, Link>> = new EventEmitter();
    public simulation: d3Force.Simulation<any, any>;

    public nodes: Node[] = [];
    public links: Link[] = [];

    constructor(nodes, links, options: { width, height }) {
        this.nodes = nodes;
        this.links = links;

        this.initSimulation(options);
    }

    initNodes() {
        if (!this.simulation) {
            throw new Error('simulation was not initialized yet');
        }

        this.simulation.nodes(this.nodes);
    }

    initLinks() {
        if (!this.simulation) {
            throw new Error('simulation was not initialized yet');
        }

        // Initializing the links force simulation
        this.simulation.force('links',
            d3Force.forceLink(this.links)
                .strength(FORCES.LINKS)
        );
    }

    initSimulation(options) {
        if (!options || !options.width || !options.height) {
            throw new Error('missing options when initializing simulation');
        }

        /** Creating the simulation */
        if (!this.simulation) {
            const ticker = this.ticker;

            // Creating the force simulation and defining the charges
            this.simulation = d3Force.forceSimulation()
                .force('charge',
                    d3Force.forceManyBody()
                        .strength(FORCES.CHARGE)
                );

            // Connecting the d3 ticker to an angular event emitter
            this.simulation.on('tick', function () {
                ticker.emit(this);
            });

            this.initNodes();
            this.initLinks();
        }

        /** Updating the central force of the simulation */
        this.simulation.force('centers', d3Force.forceCenter(options.width / 2, options.height / 2));

        /** Restarting the simulation internal timer */
        this.simulation.restart();
    }
}
