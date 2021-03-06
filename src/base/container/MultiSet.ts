//================================================================ 
/** @module std.base */
//================================================================
import { SetContainer } from "./SetContainer";

import { SetIterator } from "../iterator/SetIterator";
import { IForwardIterator } from "../../iterator/IForwardIterator";

/**
 * Base class for Multiple-key Set Containers.
 * 
 * @author Jeongho Nam <http://samchon.org>
 */
export abstract class MultiSet<Key, Source extends MultiSet<Key, Source>>
	extends SetContainer<Key, false, Source>
{
	/* ---------------------------------------------------------
		INSERT
	--------------------------------------------------------- */
	/**
	 * Insert an element.
	 * 
	 * @param pair A tuple to be referenced for the insert.
	 * @return An iterator to the newly inserted element.
	 */
	public insert(key: Key): SetIterator<Key, false, Source>;

	/**
	 * Insert an element with hint.
	 * 
	 * @param hint Hint for the position where the element can be inserted.
	 * @param pair A tuple to be referenced for the insert.
	 * @return An iterator to the newly inserted element.
	 */
	public insert(hint: SetIterator<Key, false, Source>, key: Key): SetIterator<Key, false, Source>;

	/**
	 * Insert range elements.
	 * 
	 * @param first Input iterator of the first position.
	 * @param last Input iteartor of the last position.
	 */
	public insert<U extends Key, InputIterator extends Readonly<IForwardIterator<U, InputIterator>>>
		(begin: InputIterator, end: InputIterator): void;

	public insert(...args: any[]): any
	{
		return super.insert.apply(this, args);
	}

	/* ---------------------------------------------------------
		ERASE
	--------------------------------------------------------- */
	/**
	 * @hidden
	 */
	protected abstract _Key_eq(x: Key, y: Key): boolean;

	/**
	 * @hidden
	 */
	protected _Erase_by_val(key: Key): number
	{
		let first = this.find(key);
		if (first.equals(this.end()) === true)
			return 0;

		let last = first.next();
		let ret: number = 1;

		while (!last.equals(this.end()) && this._Key_eq(key, last.value))
		{
			last = last.next();
			++ret;
		}
		this._Erase_by_range(first, last);
		return ret;
	}

	/* ---------------------------------------------------------
		UTILITY
	--------------------------------------------------------- */
	/**
	 * @inheritDoc
	 */
	public merge(source: Source): void
	{
		this.insert(source.begin(), source.end());
		source.clear();
	}
}