---
category: Dialog弹窗组件
cover: https://cdn.pixabay.com/photo/2023/07/13/06/59/canyon-8124036_1280.jpg
---

# 命令式弹窗组件封装

思考如何通过函数调用方式来生成弹窗,而不是通过设置变量引入组件的方式来控制弹窗

## 封装前准备

这里先准备一个MessageBox.vue文件这个文件书写弹窗组件的基本代码
```ts
// MessageBox.vue
<template>
  <div class="modal">
    <div class="box">
      <div class="text">{{ msg }}</div>
      <button class="btn" @click="emit('click')" type="primary">确定</button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['click'])
defineProps({
  msg: {
    type: String,
    required: true,
    default: 'Hello World',
  },
})
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 999;
  background-color: #00000050;
  display: flex;
  flex-wrap: wrap;
  place-content: center;
}

.box {
  background-color: #fff;
  color: #333;
  padding: 10em 20em;
  border-radius: 10px;
  box-shadow: 0 0 3px #00000080;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.text {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  background-color: #5a9cf8;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>


```

将该组件引入视图文件中显示可通过emit时间来控制弹窗的显示影藏

+ 思考:
    怎样通过函数调用的形式来显示弹窗并控制弹窗的影藏

1.首先必须要创建一个函数,这里我创建一个showMsg函数
2.应为弹窗需要接受参数,那我可以通过函数传参形式将弹窗需要的参数
3.我需要控制弹窗显示影藏,那我可以通过showMsg回调函数传参来接收close函数

```ts
// 在utils文件下定义工具函数showMsg
export default function showMsg(option,handlerClick){

}

```

+ 思考:
   那我该怎么去渲染弹窗?

1.参考项目中main.ts文件中怎么挂载App.vue模版来挂载渲染弹窗组件

```ts
const app = createApp(App)
app.mount('#app')
```

这里我在工具函数文件中引入`import { createApp } from 'vue'`来进行后面的组件渲染

```ts
import { createApp } from 'vue'
import { MassageBox } from "@/components"
export default function showMsg(msg,handlerClick){

let app = createApp(MassageBox,{
    msg,
    onClick(){
         handlerClick &&
        handlerClick(() => {
          app.unmount() //将该模板卸载
          div.remove() //删除创建元素
        })
    }
})
// 先创渲染容器元素
let div = document.createElement('div')
// 再将容器元素插入body
document.body.appendChild(div)
app.mount(div)
}
```

调用该弹窗

```ts
 <div class="controller">
    <el-button type="primary" @click="clickHandler">显示弹窗</el-button>
  </div>

  const clickHandler = () => {
  showMessage('显示信息', (close) => {
    console.log('点击了确定')
    close()
  })
}
```

现在基本实现了通过函数来调用弹窗,但是现在我们发现我们不想要去使用这个引入的组件,我想要自己定义弹窗的结构以及显示内容

+ 思考: 
    这里我是使用jsx的语法来实现渲染弹窗结构以及样式,其实一个.vue文件导出的也是一个对象,这里定义了一个
    `MessageBox`对象

```ts
import { createApp, createElementVNode, ComponentInternalInstance } from 'vue'
import { styled } from '@styils/vue'

const DivModal = styled('div', {
  position: 'fixed',
  width: '100%',
  height: '100%',
  left: '0',
  top: '0',
  zIndex: '999',
  backgroundColor: '#00000050',
  display: 'flex',
  flexWrap: 'wrap',
  placeContent: 'center',
})

const DivBox = styled('div', {
  backgroundColor: '#fff',
  color: '#333',
  padding: '10em 20em',
  borderRadius: '10px',
  boxShadow: '0 0 3px #00000080',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

const DivText = styled('div', {
  fontSize: '1.5rem',
  marginBottom: '1rem',
})

const Button = styled('button', {
  padding: '0.5rem 1rem',
  backgroundColor: '#5a9cf8',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
})


const MessageBox = {
  props: {
    msg: {
      type: String,
      required: true,
      default: 'Hello World',
    },
  },

  render(ctx: ComponentInternalInstance) {
    return (
      <DivModal>
        <DivBox>
          <DivText>{ctx.props.msg}</DivText>
          <Button class="btn" onClick={() => ctx.emit('onClick')}>
            确定
          </Button>
        </DivBox>
      </DivModal>
    )
  },
}

```

此时我们当初定义的MessageBox.vue文件其实也可以删除了,实现了完全命令式创建弹窗
