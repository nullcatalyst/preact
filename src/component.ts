import { RENDER } from './constants';
import { extend, clone, isFunction } from './util';
import { createLinkedState } from './linked-state';
import { renderComponent } from './vdom/component';
import { enqueueRender } from './render-queue';

export interface ComponentProps {
	ref?: (component: Component<any, any, any>) => void;
	key?: string | number;
	children?: JSX.Element[];
}

export interface ComponentNode {
	_listeners?: { [eventType: string]: (e: Event) => void };
	_componentConstructor?: typeof Component;
	_component?: Component<any, any, any>;
	_parentComponent?: Component<any, any, any>;
	normalizedNodeName?: string;
}

/** Base Component class, for the ES6 Class method of creating Components
 *	@public
 *
 *	@example
 *	class MyFoo extends Component {
 *		render(props, state) {
 *			return <div />;
 *		}
 *	}
 */
export class Component<Props, State, Context> {
	// You should NOT touch any of the values starting with an underscore
	_dirty?: boolean;
	_linkedStates?: any;
	_renderCallbacks?: (() => void)[];
	_disable?: boolean;
	_component?: Component<any, any, any>;
	_parentComponent?: Component<any, any, any>;
	__ref?: (component: this) => void;
	__key?: string | number | undefined;
	nextBase?: Element;

	base?: Element | HTMLElement | SVGElement;
	props: Props;
	state: State;
	context: Context;

	prevProps?: Props;
	prevState?: State;
	prevContext?: Context;

	constructor(props: Props, context?: Context) {
		this._dirty = true;
		this.context = context;
		this.props = props;

		if (!this.state) {
			this.state = {} as State;
		}
	}

	// Component Lifecycle
	componentWillMount?(): void;
	componentDidMount?(): void;
	componentWillUnmount?(): void;
	componentDidUnmount?(): void;
	componentWillReceiveProps?(props: Props, context?: Context): void;
	shouldComponentUpdate?(props: Props, state: State, context?: Context): boolean;
	componentWillUpdate?(props: Props, state: State, context?: Context): void;
	componentDidUpdate?(props: Props, state: State, context?: Context): void;

	getChildContext?(): any;

	/** Returns a function that sets a state property when called.
	 *	Calling linkState() repeatedly with the same arguments returns a cached link function.
	 *
	 *	Provides some built-in special cases:
	 *		- Checkboxes and radio buttons link their boolean `checked` value
	 *		- Inputs automatically link their `value` property
	 *		- Event paths fall back to any associated Component if not found on an element
	 *		- If linked value is a function, will invoke it and use the result
	 *
	 *	@param {string} key		The path to set - can be a dot-notated deep key
	 *	@param {string} [eventPath]	If set, attempts to find the new state value at a given dot-notated path within the object passed to the linkedState setter.
	 *	@returns {function} linkStateSetter(e)
	 *
	 *	@example Update a "text" state value when an input changes:
	 *		<input onChange={ this.linkState('text') } />
	 *
	 *	@example Set a deep state value on click
	 *		<button onClick={ this.linkState('touch.coords', 'touches.0') }>Tap</button
	 */
	linkState(key: string, eventPath: string) {
		let c = this._linkedStates || (this._linkedStates = {});
		return c[key+eventPath] || (c[key+eventPath] = createLinkedState(this, key, eventPath));
	}

	/** Update component state by copying properties from `state` to `this.state`.
	 *	@param {object} state		A hash of state properties to update with new values
	 */
	setState(state: Partial<State> | ((prevState: State, props: Props) => State), callback?: () => void) {
		let s = this.state;

		if (!this.prevState) {
			this.prevState = clone(s);
		}

		extend(s, isFunction(state) ? state(s, this.props) : state);
		if (callback) (this._renderCallbacks = (this._renderCallbacks || [])).push(callback);
		enqueueRender(this);
	}

	/** Immediately perform a synchronous re-render of the component.
	 *	@private
	 */
	private forceUpdate() {
		renderComponent(this, RENDER.FORCE);
	}

	/** Accepts `props` and `state`, and returns a new Virtual DOM tree to build.
	 *	Virtual DOM is generally constructed via [JSX](http://jasonformat.com/wtf-is-jsx).
	 *	@param {object} props		Props (eg: JSX attributes) received from parent element/component
	 *	@param {object} state		The component's current state
	 *	@param {object} context		Context object (if a parent component has provided context)
	 *	@returns VNode
	 */
	render(props: Props, state: State, context?: Context) {}
}
