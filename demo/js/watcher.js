/*
 * @Author: lam-jl
 * @Date: 2020-06-19 12:15:06 
 * @Last Modified by: lam-jl
 * @Last Modified time: 2020-06-19 12:30:47
 */
function Watcher (vm,exp,cb){
    this.cb = cb
    this.vm = vm
    this.exp = exp
    this.value = this.get()
}
Watcher.prototype = {
    update: function() {
        this.run() 
    },
    run: function() {
        var value = this.vm.data[this.exp],
            oldVal = this.value
        if(value !== oldVal) {
            this.value = value
            this.cb.call(this.vm,value,oldVal) 
        }
    },
    get: function() {
        Dep.target = this;  // 缓存自己
        var value = this.vm.data[this.exp] // 强制执行监听器里的get函数
        Dep.target = null // 释放自己
        return value
    }
}