﻿import { List } from "./List";

export class Queue<T>
{
	private source_: List<T>;

	/* ---------------------------------------------------------
		CONSTRUCTORS
	--------------------------------------------------------- */
	public constructor();

	public constructor(obj: Queue<T>);

	public constructor(obj: Queue<T> = null)
	{
		this.source_ = new List<T>();

		if (obj != null)
			this.source_.assign(obj.source_.begin(), obj.source_.end());
	}

	/* ---------------------------------------------------------
		ACCESSORS
	--------------------------------------------------------- */
	public size(): number
	{
		return this.source_.size();
	}

	public empty(): boolean
	{
		return this.source_.empty();
	}
	
	public front(): T
	{
		return this.source_.front();
	}

	public back(): T
	{
		return this.source_.back();
	}

	/* ---------------------------------------------------------
		ELEMENTS I/O
	--------------------------------------------------------- */
	public push(...elems: T[]): void
	{
		this.source_.push(...elems);
	}

	public pop(): void
	{
		this.source_.pop_front();
	}

	public swap(obj: Queue<T>): void
	{
		[this.source_, obj.source_] = [obj.source_, this.source_];
	}
}

export type queue<T> = Queue<T>;
export var queue = Queue;