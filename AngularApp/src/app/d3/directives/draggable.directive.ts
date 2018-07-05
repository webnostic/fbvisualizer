import { Directive, Input, ElementRef } from '@angular/core';
import { D3Service } from '../../d3/d3.service';
import { ForceDirectedGraph } from '../../d3/models/force-directed-graph';
import { Node } from '../../d3/models/node';

@Directive({
    selector: '[draggableNode]'
})
export class DraggableDirective {
    @Input('draggableNode') node: Node;
    @Input('draggableInGraph') graph: ForceDirectedGraph;

    constructor(private d3Service: D3Service, private _element: ElementRef) { }

    ngOnInit() {
        this.d3Service.applyDraggableBehaviour(this._element.nativeElement, this.node, this.graph);
    }
}