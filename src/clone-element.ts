import { clone, extend } from './util';
import { h } from './h';
import { VNode } from './vnode';
import { ComponentProps } from './component';

export function cloneElement<Props>(vnode: VNode, props: Partial<Props & ComponentProps>) {
	return h<Props>(
		vnode.nodeName,
		extend(clone(vnode.attributes as Props), props),
		arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children
	);
}
