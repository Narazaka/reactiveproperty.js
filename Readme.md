# [reactiveproperty.js - ReactiveProperty for RxJS](https://github.com/Narazaka/reactiveproperty.js)

Partial javascript implementation of https://github.com/runceel/ReactiveProperty.

## Synopsys

```typescript
import { ReactiveProperty } from "reactiveproperty";

class MyClass {
    myProperty: ReactiveProperty<string>;

    constructor(str: string) {
        this.myProperty = new ReactiveProperty<string>(str);
    }
}

const obj = new MyClass("foo");
obj.myProperty.subscribe(str => console.log(str));
// > foo
obj.myProperty.value = "bar";
// > bar
```

## See also

- [observable-collection](https://github.com/Narazaka/observable-collection.js)
- [reactiveproperty-rxjs](https://github.com/paveldk/reactiveproperty-rxjs)

## License

This is released under [MIT License](http://narazaka.net/license/MIT?2017).
