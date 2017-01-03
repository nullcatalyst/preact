import { Component } from './component';

/** Virtual DOM Node */
export class VNode {
	nodeName: string | typeof Component;
	attributes: { [id: string]: any };
	children: (VNode | string)[] | undefined;
	key: string | number | undefined;

	constructor(nodeName: string | typeof Component, attributes: { key?: string | number; [id: string]: any }, children?: VNode[]) {
		/** @type {string|function} */
		this.nodeName = nodeName;

		/** @type {object<string>|undefined} */
		this.attributes = attributes;

		/** @type {array<VNode>|undefined} */
		this.children = children;

		/** Reference to the given key. */
		this.key = attributes && attributes.key;
	}
}
