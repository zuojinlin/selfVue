/*
 * @Project: observer Dep
 * @Author: lam-jl 
 * @Date: 2020-06-18 11:52:42 
 * @Last Modified by: lam-jl
 * @Last Modified time: 2020-06-19 12:14:38
 */
// 监听器
function Observer(data) {
    this.data = data;
    this.walk(data)
}


Observer.prototype = {
    walk: function(data) {
        var _this = this;
        Object.keys(data).forEach(function(key) {
            _this.defineReactive(data, key, data[key])
        })
    },
    defineReactive: function(data, key,val) {
        var dep = new Dep()
        var childObj = observe(val)   // 递归遍历所有子属性
        Object.defineProperty(data, key, {
            // 当且仅当该属性的 enumerable 键值为 true 时，该属性才会出现在对象的枚举属性中。
            enumerable: true,
            // configurable 特性表示对象的属性是否可以被删除，以及除 value 和 writable 特性外的其他特性是否可以被修改。
            // 如果 configurable 属性为 true，则不会抛出任何错误，并且，最后，该属性会被删除。
            configurable: true,
            get: function() {
                // 判断是否需要添加订阅者
                if(Dep.target){   
                    dep.addSub(Dep.target); // 在这里添加一个订阅者
                }
                return val
            },
            set: function(newVal) {
                if(newVal === val) {
                    return;
                }
                val = newVal
                console.log(`属性${key}已经被监听了，现在值为${newVal.toString()}`)
                dep.notify()    // 如果数据变化，通知所有订阅者
            }
        })
    }
}
function observe(value, vm) {
    // 类型判断
    if(!value || typeof value !== 'object'){
        return;
    } else {
        return new Observer(value)
    }
}

// 订阅者
function Dep () {
    this.subs = []
}

Dep.prototype = {
    addSub: function(sub) {
        this.subs.push(sub)
    },
    notify: function(){
        console.log(this)
        this.subs.forEach(function(sub) {
            sub.update();
        });
    }
}

Dep.target = null;