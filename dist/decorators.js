export function grayBalls() {
    return function (target, key) {
        let val = target[key];
        const getter = () => {
            return val;
        };
        const setter = (next) => {
            val = ['#000000', '#404040', '#585858', '#707070', '#909090', '#A9A9A9', '#C0C0C0'];
        };
        Object.defineProperty(target, key, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true,
        });
    };
}
export function heheszki() {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        const heheszki = ["XD", "LOL", "SłABO", "PRÓBUJ DALEJ", "MOŻE NASTĘPNYM RAZEM", "NIE DAłOBY TO NIC", "NIC BY TO NIE DAłO "];
        descriptor.value = function (...args) {
            const result = originalMethod.apply(this, args);
            alert(heheszki[(Math.floor(Math.random() * heheszki.length))]);
            return result;
        };
    };
}
