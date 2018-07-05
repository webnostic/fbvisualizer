import { Injectable, EventEmitter } from '@angular/core';
import { Node, Link, ForceDirectedGraph } from './models';
import * as d3 from 'd3';
import * as d3Force from 'd3-force';
import * as d3Zoom from 'd3-zoom';
import * as d3Drag from 'd3-drag';

@Injectable()
export class D3Service {
  /** This service will provide methods to enable user interaction with elements
    * while maintaining the d3 simulations physics
    */
  constructor() { }

  /** A method to bind a pan and zoom behaviour to an svg element */
  applyZoomableBehaviour(svgElement, containerElement) {
    let svg, container;

    svg = d3.select(svgElement);
    container = d3.select(containerElement);

    svg.call((<any>d3).zoom().on('zoom',
        function () {
          svg.attr('transform', (<any>d3.event).transform);
        }));
  }

  /** A method to bind a draggable behaviour to an svg element */
  applyDraggableBehaviour(element, node: Node, graph: ForceDirectedGraph) {
    const d3element = d3.select(element);

    function started() {
      if (!(<any>d3.event).active) {
        graph.simulation.alphaTarget(0.3).restart();
      }

      (<any>d3.event).on('drag', dragged).on('end', ended);

      function dragged() {
        node.fx = (<any>d3.event).x;
        node.fy = (<any>d3.event).y;
      }

      function ended() {
        if (!(<any>d3.event).active) {
          graph.simulation.alphaTarget(0);
        }

        node.fx = null;
        node.fy = null;
      }
    }

    d3element.call((<any>d3).drag()
      .on('start', started));
  }

  /** The interactable graph we will simulate in this article
  * This method does not interact with the document, purely physical calculations with d3
  */
  getForceDirectedGraph(nodes: Node[], links: Link[], options: { width, height }) {
    return new ForceDirectedGraph(nodes, links, options);
  }
}
