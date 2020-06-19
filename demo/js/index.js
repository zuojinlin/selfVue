/*
 * @Project: SelfVue
 * @Author: lam-jl
 * @Date: 2020-06-18 11:31:04 
 * @Last Modified by: lam-jl
 * @Last Modified time: 2020-06-19 12:14:04
 */

function SelfVue (options) {
    // Vue2.+ options的写法
    var _this = this;
    // this.vm = this;
    this.data = options.data;
    this.methods = options.methods;
    Object.keys(this.data).forEach(function(key) {
        // 遍历所有options的可枚举属性 通过proxyKeys让其可以this.data.property => this.property
        _this.proxyKeys(key);
    });
    // 把所有data的数据获取到 交给observe去监听劫持所有属性
    observe(this.data);
    // TODO:
    new Compile(options.el, this);
    options.mounted.call(this); // 所有事情处理好后执行mounted函数
    return this;
}
SelfVue.prototype = {
    proxyKeys: function(key) {
        var _this = this;
        Object.defineProperty(this,key,{
            enumerable: false,
            configurable: true,
            get: function proxyGetter() {
                return _this.data[key];
            },
            set: function proxySetter(newVal) {
                _this.data[key] = newVal;
            }
        })
    }
}