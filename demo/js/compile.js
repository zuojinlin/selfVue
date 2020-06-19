/*
 * @Author: lam-jl
 * @Date: 2020-06-19 12:05:14 
 * @Last Modified by: lam-jl
 * @Last Modified time: 2020-06-19 12:31:17
 */


/**
 * @project Compile
 * @param {myvue实例元素} el 
 * @param {myvue实例} vm 
 */
function Compile (el,vm) {
    this.vm = vm;
    this.el = document.querySelector(el);
    this.fragment = null;
    this.init()
}

Compile.prototype = {
    init: function() {
        if(this.el) {
            // 证明有元素
            this.fragment = this.nodeToFragment(this.el)
            this.compileElement(this.fragment)
            this.el.appendChild(this.fragment)
        } else {
            console.log('Dom元素不存在');
        }
    },
    nodeToFragment: function (el) {
        var fragment = document.createDocumentFragment(),
            child = el.firstChild;
        while(child) {
            fragment.appendChild(child)
            child = el.firstChild
        }
        return fragment
    },

    compileElement: function(el) {
        var childNodes = el.childNodes,
            _this = this;
        // el.childNodes是伪数组没有foreach方法 需要通过.clice.call(this)转成数组
        [].slice.call(childNodes).forEach(node => {
            var reg = /\{\{\s*(.*?)\s*\}\}/,
                text = node.textContent
            if(_this.isElementNode(node)){
                _this.compile(node)
            }
            else if(_this.isTextNode(node) && reg.test(text)){   // 判断是否是符合这种形式{{}}的指令
                _this.compileText(node, reg.exec(text)[1]);
            }

            if(node.childNodes && node.childNodes.length){
                _this.compileElement(node)  // 继续递归遍历子节点
            }
        })
    },
    compile: function(node) {
        var nodeAttrs = node.attributes;
        var _this = this;
        Array.prototype.forEach.call(nodeAttrs, function(attr){
            var attrName = attr.name;
            if(_this.isDirective(attrName)){
                var exp = attr.value,   // 属性名
                    dir = attrName.substring(2) // 属性名
                // 判断是事件修改数据还是v-model修改
                if(_this.isEventDirective(dir)){
                    _this.compileEvent(node, _this.vm, exp, dir)
                } else {
                    _this.compileModel(node, _this.vm, exp, dir)
                }
                node.removeAttribute(attrName)
            }
        })
    },
    compileText: function(node,exp) {
        var _this = this,
            initText = this.vm[exp]
        this.updateText(node, initText) // 将初始化的数据初始化到视图中
        new Watcher(this.vm, exp, function (value) {  // 生成订阅器并绑定更新函数
            _this.updateText(node, value);
        });
    },
    compileEvent: function(node, vm, exp, dir) {
        var eventType = dir.split(':')[1];
        var cb = vm.methods && vm.methods[exp];
        
        if(eventType && cb) {
            node.addEventListener(eventType,cb.bind(vm),false)
        }
    },
    compileModel: function(node,vm,exp,dir) {
        var _this = this;
        var val = this.vm[exp]
        this.modelUpdater(node,val)
        new Watcher(this.vm,exp, function(value){
            _this.modelUpdater(node,value)
        })

        node.addEventListener('input',function(e) {
            var newValue = e.target.value;
            if(val === newValue) {
                return;
            }
            _this.vm[exp] = newValue;
            val = newValue;
        })
    },
    updateText: function(node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value;
    },
    modelUpdater: function(node, value, oldValue) {
        node.value = typeof value == 'undefined' ? '' : value;
    },
    isDirective: function(attr) {
        return attr.indexOf('v-') == 0;
    },
    isEventDirective: function(dir) {
        return dir.indexOf('on:') === 0;
    },
    isElementNode: function (node) {
        return node.nodeType == 1;
    },
    isTextNode: function(node) {
        return node.nodeType == 3;
    }
}