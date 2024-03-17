const PENDING = Symbol('PENDING');
const FULLFILLED = Symbol('FULLFILLED');
const REJECTED = Symbol('REJECTED');

enum Status {
    PENDING,
    FULLFILLED,
    REJECTED
}

type Executor = (resolve: (value: any) => void, reject: (reason: any) => void) => void;

class MyPromise {
    status: Status;
    data: any;
    reason: any;

    onResolvedCallbacks: Function[];
    onRejectedCallbacks: Function[];

    constructor(executor: Executor) {
        this.status = Status.PENDING;
        this.data = null;
        this.reason = null;
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];

        const resolve = (data: any) => {
            console.log('resolve');
            if (this.status === Status.PENDING) {
                this.status = Status.FULLFILLED;
                this.data = data;
                this.onResolvedCallbacks.forEach(fn => fn());
            }
        };

        const reject = (reason: any) => {
            console.log('reject');
            if (this.status === Status.PENDING) {
                this.status = Status.REJECTED;
                this.reason = reason;
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        };

        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    then(onFullfilled: (value: any) => any, onRejected: (reason: any) => any) {
        if (this.status === Status.FULLFILLED) {
            onFullfilled(this.data);
        } else if (this.status === Status.REJECTED) {
            onRejected(this.reason);
        } else if (this.status === Status.PENDING) {
            this.onResolvedCallbacks.push(() => {
                onFullfilled(this.data);
            });
            this.onRejectedCallbacks.push(() => {
                onRejected(this.reason);
            });
        }
    }
}

console.log("测试 MyPromise");
new MyPromise((resolve, reject) => {
    setTimeout(() => {
        console.log('执行完成');
        resolve('success');
    }, 1000);
}).then((data) => {
    console.log('回调成功');
    console.log(data);
}, (reason) => {
    console.log(reason);
});

new MyPromise((resolve, reject) => {
    setTimeout(() => {
        console.log('执行完成');
        reject('failure');
    }, 1000);
}).then((data) => {
    console.log('回调成功');
    console.log(data);
}, (reason) => {
    console.log('回调成功');
    console.log(reason);
});

export default MyPromise;
