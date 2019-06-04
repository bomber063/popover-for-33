# popover-for-33
# 写出一个点开浮层、关闭浮层的例子，要求
1. 点击按钮弹出浮层
2. 点击别处关闭浮层
3. 点击浮层时，浮层不得关闭
4. 再次点击按钮，浮层消失

# 实现前面2步
* 两种方法：
1. 通过true和false设置冒泡和捕获。  
JSbin代码[链接](https://jsbin.com/fovaqopito/1/edit?html,css,js,output)  
2. 用 e.stopPropagation()实现。  
JSbin代码[链接](https://jsbin.com/debugipavu/1/edit?html,css,js,output)  
以上两个方案都没有考虑浮层里面的checkbox  

# 实现前面第1,2,4步并且节省内存，节省内存用到one()
## 使用异步操作
* 用到[set​Timeout](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/setTimeout),混合的 setTimeout()方法设置一个定时器，该定时器在定时器到后期执行一个函数胡总和指定一段代码，**计算设置的延迟是0，也是异步，代表尽快的去做事件**。
使用了setTimeout后在点击按钮的时候不会执行setTimeout里面的函数，需要第二次点击之后才会去执行，**因为异步就是先执行DOM事件中的捕获及冒泡，结束之后在去执行setTimeout里面的函数。**
```
$(clickMe).on('click',function(){
  $(popover).show()
  console.log('show')
  setTimeout(function(){//第一次点击这里不会执行，只会执行冒泡及捕获的DOM事件
    console.log('添加one click')
    $(document).one('click',function(){
    console.log('我觉得这里不会执行')
    console.log('hide')
    $(popover).hide()
  })
 },0)
})
```
* 异步的JS代码[链接](https://jsbin.com/bubucugiki/edit?js,output)
* 如果不用set​Timeout，那么第一次点击的时候就会执行one里面的代码，**此时代表DOM事件的捕获及冒泡同绑定的事件同时执行，没有停下来。**
```
$(clickMe).on('click',function(){
  $(popover).show()
  $(document).one('click',function(){//这里绑定的one事件会在DOM事件的时候就执行。
    console.log('我觉得这里不会执行')
    console.log('document')
    $(popover).hide()
  })
})
```
* 同步的JS代码[链接](https://jsbin.com/jamisazova/edit?html,js,output)

## one就是为了节省内存
* [one()](https://www.jquery123.com/one/)为元素的事件添加处理函数。处理函数在每个元素上每种事件类型**最多执行一次**。因为只有一次，那么不会每次都执行它，如果有上万次这里也只有一次。

# 实现前面第1,2,3,4步并且节省内存
* 实现第三步需要用到JQ中的toggle事件，如果用addClass，来display：none和display:block也可以。
* 为了点击浮层时，浮层不得关闭，那么需要在浮层的父元素上面阻止冒泡。
```
$(clickMe).on('click',function(){
  $(popover).toggle()
  console.log('show')
  setTimeout(function(){
    console.log('添加one click')
    $(document).one('click',function(){
    console.log('我觉得这里不会执行')
    console.log('hide')
    $(popover).hide()
  })
 },0)
})

  $('#wrapper').on('click',function(e){//在浮层的父元素上面阻止DOM事件传播
    e.stopPropagation()
  })
```
JSbin代码[链接](https://jsbin.com/pofosilisa/1/edit?html,js,output)
它的效果其实类似于
```
$(clickMe).on('click', function () {
  if (popover.style.display === 'block') {
    $(popover).hide()
  } else {
    $(popover).show()
    $(document).one('click', function () {
      $(popover).hide()
    })
  }
})
$(wrapper).on('click', function (a) {
  a.stopPropagation()
})
```



* 如果在浮层上阻止冒泡那么，不可以重复点击按钮使得消失和出现重复出现，需要点击document之后才会重复消失和出现，因为document再次绑定为hide，那么下一次就是show。
```
$(clickMe).on('click',function(){
  $(popover).toggle()
  console.log('show')
  setTimeout(function(){
    console.log('添加one click')
    $(document).one('click',function(){
    console.log('我觉得这里不会执行')
    console.log('hide')
    $(popover).hide()
  })
 },0)
})

  $('#popover').on('click',function(e){//这里在浮层阻止传播事件，就不可以重复点击按钮出现和消失，需要点击别处之后才可以重复。
    e.stopPropagation()
  })
```
* JSbin代码[链接](https://jsbin.com/pisakebiku/1/edit?html,js,output)


# 用到的API
## JQ的.toggle()
.toggle()用处有两种：
1. [.toggle()](https://www.jquery123.com/toggle/)可以显示或隐藏匹配元素。**浮层这个任务主要用到这个**
2. [.toggle()](https://www.jquery123.com/toggle-event/)绑定两个或多个处理程序绑定到匹配的元素，用来执行在交替的点击。

## 原生JS的event.stopPropagation
[event​.stop​Propagation](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/stopPropagation)阻止捕获和冒泡阶段中当前事件的进一步传播。


# 涉及到的其他信息
## 三角形用到伪元素
* 如果伪类是绝对定位，那么[after](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::after)和[before](https://developer.mozilla.org/zh-CN/docs/Web/CSS/::before)里面的[content](https://developer.mozilla.org/zh-CN/docs/Web/CSS/content)对应的盒模型都是在这个文字的前面，并且挤在一起，因为已经脱离文档流。
* 测试的JSbin代码[链接1](https://jsbin.com/weqijunoca/1/edit?html,css,output)
* 测试的JSbin代码[链接2](https://jsbin.com/kayatuduti/1/edit?html,css,output)
* 测试的JSbin代码[链接3](https://jsbin.com/nibiborowa/1/edit?html,css,output)
* 测试的JSbin代码[链接4](https://jsbin.com/pibudanepe/1/edit?html,css,js,output)

## 监听body
* 监听body监听不到测试。因为body不够高，监听document才可以监听到整个页面文档。
监听document也即是文档的[根元素](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/documentElement)，那么可以用两种：  
1. Document.documentElement 是一个会返回文档对象（document）的根元素的只读属性（如HTML文档的 <html> 元素）。
2. HTML 文档通常包含一个子节点 <html>，可能在它前面还有个 DOCTYPE 声明。所以你应该使用 document.documentElement 来获取根元素, 而不是 document.firstChild。 当然用document.firstElementChild也可以获取根元素。

## debugger
* [debugger](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/debugger) 语句调用任何可用的调试功能，例如设置断点。 如果没有调试功能可用，则此语句不起作用。
* 当 debugger 被调用时, 执行暂停在 debugger 语句的位置。就像在脚本源代码中的断点一样。
## q
* HTML引用标签 [(<q>)](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/q)表示一个封闭的并且是短的行内引用的文本. 这个标签是用来引用短的文本，所以请不要引入换行符; 对于长的文本的引用请使用 [<blockquote>](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/blockquote) 替代.
## content
* CSS的 content CSS 属性用于在元素的  ::before 和 ::after 伪元素中插入内容。使用[content](https://developer.mozilla.org/zh-CN/docs/Web/CSS/content) 属性插入的内容都是匿名的可替换元素。
## white-space
* [white-space](https://developer.mozilla.org/zh-CN/docs/Web/CSS/white-space) CSS 属性是用来设置如何处理元素中的空白。

## IE bug
* google搜ie stopPropagation checkbox bug，阻止默认事件[e.preventDefault()](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/preventDefault)
* google之后找到的[链接地址](https://stackoverflow.com/questions/1164213/how-to-stop-event-bubbling-on-checkbox-click)

## on()里面的false
* [on()](https://www.jquery123.com/on/)里面可以直接写入false，调用[event.stopPropagation()](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/stopPropagation) 和 [event.preventDefault()](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/preventDefault)会从一个事件处理程序会自动返回false。也可以直接将 false 当作 handler 的参数，作为 function(){ return false; } 的简写形式。因此，**下面的写法 $("a.disabled").on("click", false);  将会阻止所有含有 "disabled" 样式的链接的默认行为，并阻止该事件上的冒泡行为。**

## JQ不支持true和false冒泡和捕获

## 这个代码在github上的预览加上html后缀就不能预览，不知道为什么。
* 经过一天之后再次用html后缀就可以正常预览了，可能是需要后台处理吧，也可以说明加上后缀的后台处理是最慢的。
* 如果html文件名字是index可以不加后缀，或者直接不写html文件。

