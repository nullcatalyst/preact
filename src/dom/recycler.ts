import { toLowerCase } from '../util';
import { removeNode } from './index';
import { ComponentNode } from '../component';

/** DOM node pool, keyed on nodeName. */

const nodes: { [nodeName: string]: Node[] } = {};

export function collectNode(node: Node & ComponentNode) {
	removeNode(node);

	if (node instanceof Element) {
		(node as ComponentNode)._component = (node as ComponentNode)._componentConstructor = null;

		let name = (node as ComponentNode).normalizedNodeName || toLowerCase(node.nodeName);
		(nodes[name] || (nodes[name] = [])).push(node);
	}
}

export function createNode(nodeName: string, isSvg?: boolean): Node {
	let name = toLowerCase(nodeName),
		node = nodes[name] && nodes[name].pop() || (isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName));
	(node as ComponentNode).normalizedNodeName = name;
	return node;
}
