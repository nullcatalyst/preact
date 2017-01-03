import { VNode } from './vnode';
import { Component } from './component';

/** Global options
 *	@public
 *	@namespace options {Object}
 */
export default {

	/** If `true`, `prop` changes trigger synchronous component updates.
	 *	@name syncComponentUpdates
	 *	@type Boolean
	 *	@default true
	 */
	//syncComponentUpdates: true,

	/** Processes all created VNodes.
	 *	@param {VNode} vnode	A newly-created VNode to normalize/process
	 */
	//vnode(vnode) { }

	/** Hook invoked after a component is mounted. */
	// afterMount(component) { }

	/** Hook invoked after the DOM is updated with a component's latest render. */
	// afterUpdate(component) { }

	/** Hook invoked immediately before a component is unmounted. */
	// beforeUnmount(component) { }
} as Options;

interface Options {
	syncComponentUpdates?: boolean;

	vnode?(vnode: VNode): void;
	debounceRendering?(rerender: () => void): void;
	event?(e: Event): Event | undefined;
	afterMount?(component: Component<any, any, any>): void;
	afterUpdate?(component: Component<any, any, any>): void;
	beforeUnmount?(component: Component<any, any, any>): void;
}
