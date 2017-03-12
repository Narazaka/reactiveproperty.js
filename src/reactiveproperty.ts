import {Subject} from "rxjs";
import {Subscribable} from "rxjs/Observable";
import {PartialObserver} from "rxjs/Observer";
import {ISubscription, Subscription} from "rxjs/Subscription";
import {toSubscriber} from "rxjs/util/toSubscriber";

export interface IReactiveProperty<T> extends Subscribable<T>, ISubscription {
    value: T;
}

export type ReactivePropertyMode = {
    /** If next value is same as current, not set and not notify. */
    distinctUntilChanged?: boolean;
    /** Push notify on instance created and subscribed. */
    raiseLatestValueOnSubscribe?: boolean;
};

export class ReactiveProperty<T> implements IReactiveProperty<T> {
    closed = false;
    private latestValue: T;
    private readonly isDistinctUntilChanged: boolean;
    private readonly isRaiseLatestValueOnSubscribe: boolean;

    private readonly source = new Subject<T>();

    constructor(
        initialValue?: T,
        mode: ReactivePropertyMode = {distinctUntilChanged: true, raiseLatestValueOnSubscribe: true},
    ) {
        if (initialValue) this.latestValue = initialValue;

        this.isRaiseLatestValueOnSubscribe = Boolean(mode.raiseLatestValueOnSubscribe);
        this.isDistinctUntilChanged = Boolean(mode.distinctUntilChanged);
    }

    /** Get latestValue or push(set) value. */
    get value(): T {
        return this.latestValue;
    }

    set value(value: T) {
        if (this.latestValue == null || value == null) {
            if (this.isDistinctUntilChanged && this.latestValue && value == null)  return;
            this.setValue(value);
            return;
        }

        if (this.isDistinctUntilChanged && this.latestValue === value) return;

        this.setValue(value);
    }

    /** Subscribe source. */
    subscribe(): Subscription;
    subscribe(observer: PartialObserver<T>): Subscription;
    subscribe(next?: (value: T) => void, error?: (error: any) => void, complete?: () => void): Subscription;
    subscribe(
        observerOrNext?: PartialObserver<T> | ((value: T) => void),
        error?: (error: any) => void,
        complete?: () => void,
    ) {
        const observer = toSubscriber(observerOrNext, error, complete);
        if (this.isRaiseLatestValueOnSubscribe) observer.next(this.latestValue);
        return this.source.subscribe(observer);
    }

    /** Unsubscribe all subscription. */
    unsubscribe() {
        if (this.closed) return;

        this.closed = true;
        this.source.complete();
        this.source.unsubscribe();
    }

    /** Invoke next. */
    forceNotify() {
        this.setValue(this.latestValue);
    }

    private setValue(value: T) {
        this.latestValue = value;
        this.source.next(value);
    }
}
