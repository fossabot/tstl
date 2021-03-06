//================================================================ 
/** @module std */
//================================================================
import { _ISharedLockable } from "../base/thread/_ISharedLockable";
import { _ISharedTimedLockable } from "../base/thread/_ISharedTimedLockable";

import { _SafeLock } from "../base/thread/_SafeLock";

export class SharedLock<Mutex extends IMutex>
{
	/**
	 * @hidden
	 */
	private mutex_: Mutex;

	/* ---------------------------------------------------------
		CONSTRUCTORS
	--------------------------------------------------------- */
	public constructor(mutex: Mutex)
	{
		this.mutex_ = mutex;

		this.try_lock_for = mutex.try_lock_shared_for instanceof Function
			? SharedLock.try_lock_for.bind(undefined, this.mutex_)
			: undefined;
		this.try_lock_until = mutex.try_lock_shared_until instanceof Function
			? SharedLock.try_lock_until.bind(undefined, this.mutex_)
			: undefined;
	}

	public try_lock_for: "try_lock_shared_for" extends keyof Mutex
		? (ms: number, closure: Closure) => Promise<boolean>
		: undefined;
	
	public try_lock_until: "try_lock_shared_until" extends keyof Mutex
		? (at: Date, closure: Closure) => Promise<boolean>
		: undefined;

	/* ---------------------------------------------------------
		COMMON METHODS
	--------------------------------------------------------- */
	public lock(closure: Closure): Promise<void>
	{
		return SharedLock.lock(this.mutex_, closure);
	}
	
	public try_lock(closure: Closure): Promise<boolean>
	{
		return SharedLock.try_lock(this.mutex_, closure);
	}
}

export namespace SharedLock
{
	/* ---------------------------------------------------------
		STATIC FUNCTIONS
	--------------------------------------------------------- */
	export function lock<Mutex extends Pick<_ISharedLockable, "lock_shared"|"unlock_shared">>
		(mutex: Mutex, closure: Closure): Promise<void>
	{
		return _SafeLock.lock
		(
			() => mutex.lock_shared(),
			() => mutex.unlock_shared(),
			closure
		);
	}

	export function try_lock<Mutex extends Pick<_ISharedLockable, "try_lock_shared"|"unlock_shared">>
		(mutex: Mutex, closure: Closure): Promise<boolean>
	{
		return _SafeLock.try_lock
		(
			() => mutex.try_lock_shared(),
			() => mutex.unlock_shared(),
			closure
		);
	}

	export function try_lock_for<Mutex extends Pick<_ISharedTimedLockable, "try_lock_shared_for"|"unlock_shared">>
		(mutex: Mutex, ms: number, closure: Closure): Promise<boolean>
	{
		return _SafeLock.try_lock
		(
			() => mutex.try_lock_shared_for(ms),
			() => mutex.unlock_shared(),
			closure
		);
	}

	export function try_lock_until<Mutex extends Pick<_ISharedTimedLockable, "try_lock_shared_until"|"unlock_shared">>
		(mutex: Mutex, at: Date, closure: Closure): Promise<boolean>
	{
		return _SafeLock.try_lock
		(
			() => mutex.try_lock_shared_until(at),
			() => mutex.unlock_shared(),
			closure
		);
	}
}
export import shared_lock = SharedLock;

type IMutex = _ISharedLockable & Partial<_ISharedTimedLockable>;
type Closure = () => void | Promise<void>;