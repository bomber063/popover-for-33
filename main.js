// clickMe.addEventListener('click',function(){
//   popover.style.display='block';
// })

// document.addEventListener('click',function(){
//   popover.style.display='none';
// },true)

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
  
    $('#wrapper').on('click',function(e){
      e.stopPropagation()
    })
  
  //加上setTimeout就变成了异步，这样已经执行过的函数就不会再次被执行了，
  //也就是不会有这两行代码执行    
  //console.log('我觉得这里不会执行')
  // console.log('document')