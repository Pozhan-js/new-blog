---
category: WaterFull组件
cover: https://cdn.pixabay.com/photo/2023/07/13/06/59/canyon-8124036_1280.jpg
---

# 实现瀑布流Grid布局

## 开始实现布局

```ts

<template>
  <el-card>
    <div class="header">
      <el-button type="primary" @click="refresh">重新加载</el-button>
    </div>
    <TransitionGroup name="list" tag="div" class="waterfall-box">
      <div class="water-container">
        <div class="body">
          <div
            class="waterfall-item"
            v-for="(item, index) in config.list"
            :key="item.id"
          >
            <img
              class="pic"
              :src="item.photo"
              alt=""
              :ref="e => setItemStyle(e as any, index)"
            />
            <div class="title">{{ item.title }}</div>
            <div class="content text-ellipsis text-ellipsis-2">
              {{ item.text }}
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </el-card>
</template>


<style lang="scss" scoped>
.header {
  height: 50px;
}

.water-container {
  background-color: #f5f5f5;
  color: white;
  border-radius: 5px;

  .body {
    --column: 4;
    display: grid;
    grid-template-columns: repeat(var(--column), 1fr);
    grid-gap: 0 20px;
    padding: 20px;
    // grid-auto-rows: 2px;
    align-items: end;

    .waterfall-item {
      background-color: #fff;
      margin-bottom: 20px;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
      padding: 10px;
      display: flex;
      flex-direction: column;
      transition: all 0.3s;

      &:hover {
        box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.24);
        transform: scale(0.98);
      }

      .pic {
        display: block;
        width: 100%;
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 14px;
      }

      .title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 8px;
        color: black;
      }

      .content {
        font-size: 14px;
        color: #222;
        line-height: 1.4;
        width: fit-content;
        display: flex;
      }
    }
  }
}

.group-move,
.group-enter-active,
.group-leave-active {
  transition: 0.8s all;
}

.group-enter-from,
.group-leave-to {
  opacity: 0;
  transform: translate3d(0px, 30px, 0);
}

.group-leave-active {
  position: absolute;
}
</style>

```

开始逻辑处理,这里我是模拟接口数据请求

```ts
import { randomText, ranInt } from '@/utils'
import loadFail from '@/assets/images/load-fail.png'

export interface ItemInfo {
  id: number
  title: string
  text: string
  /** 图片路径 */
  photo: string
  /** 图片的宽度，前端获取图片信息之后设置 */
  width?: number
  /** 图片的高度，前端获取图片信息之后设置 */
  height?: number
  /**
   * 当前节点的所在列的高度
   * - 非列的总高度，只是调试用
   */
  currentColumnHeight?: number
}

export type ItemList = Array<ItemInfo>

let id = 0

/**
 * 图片前缀
 * [图片来源](https://lol.qq.com/data/info-heros.shtml)
 */
const photoPrefix = 'https://game.gtimg.cn/images/lol/act/img'

const list1 = [
  '/champion/Talon.png',
  '/champion/Quinn.png',
  '/champion/Vladimir.png',
  '/champion/Sona.png',
  '/champion/Zed.png',
  '/champion/MissFortune.png',
  '/champion/Lux.png',
]

const list2 = [
  '/skinloading/106000.jpg',
  '/skinloading/107000.jpg',
  '/skinloading/110000.jpg',
  '/skinloading/111000.jpg',
  '/skinloading/112000.jpg',
  '/skinloading/113000.jpg',
  '/skinloading/114000.jpg',
]

const getPhotoList = () => (!Math.round(Math.random()) ? list1 : list2)

/**
 *
 * @param maxDelay 最大延迟毫秒数，不能低于`100`
 */
export function useRequest(maxDelay = 1000) {
  /**
   * 模拟接口请求列表
   * @param total 条数
   */
  function getList(total: number): Promise<{ code: number; data: ItemList }> {
    return new Promise(function (resolve, reject) {
      const list: ItemList = []
      for (let i = 0; i < total; i++) {
        id++
        const photos = getPhotoList()
        list.push({
          id: id,
          title: '卡片标题-' + id,
          text: randomText(4, 58),
          // photo: `https://picsum.photos/300/${ranInt(200, 500)}`, // 大陆被墙了
          photo: photoPrefix + photos[ranInt(0, photos.length - 1)],
        })
      }
      setTimeout(function () {
        resolve({ code: 1, data: list })
      }, ranInt(100, maxDelay))
    })
  }

  const defaultPic = {
    data: loadFail,
    width: 200,
    height: 200,
  }

  return {
    getList,
    defaultPic,
  }
}

```

开始书写逻辑,首先考虑当窗口大小变化时,瀑布流列数改变,这里想到Window.resize,但是后面了解到IntersectionObserve监听元素变化的api于是这里便引用这个api实现元素监听
```ts

let observer: ResizeObserver
onMounted(() => {
  refresh()
  let el = document.querySelector('.body')! as HTMLElement
  observer = new ResizeObserver((entries) => {
    const rect = entries[0].contentRect // 获取目标元素的内容区域尺寸
    console.log(rect.width, rect.height)
    if (rect.width > 1000) {
      config.column = 4
    } else if (rect.width > 600) {
      config.column = 3
    } else if (rect.width > 400) {
      config.column = 2
    }

    el.style.setProperty('--column', config.column.toString())
  })

  observer.observe(el)
})

onUnmounted(function () {
  // 停止监听
  observer.disconnect()
})
```

这里我通过监听容器元素来设置容器元素的 `--column`css变量,来实现列数的动态改变

然后修改布局效果,开始拉伸空白区域
```ts

function setItemStyle(img: HTMLImageElement, index: number) {
  if (!img) return
  function update() {
    const item = img.parentElement
    if (!item) return
    const gapRows = index >= config.column ? config.column * 2 : 0
    const rows = Math.ceil(item.clientHeight / 2) + gapRows
    item.style.gridRowEnd = `span ${rows}`
  }
  update()
  img.onload = update
  img.onerror = function () {
    img.src = defaultPic.data
    update()
  }
}

async function getData(reset = false) {
  config.loading = true
  const res = await getList(20)
  config.loading = false
  if (res.code === 1) {
    if (reset) {
      config.list = res.data
    } else {
      config.list = config.list.concat(res.data)
    }
  }
}

const refresh = () => {
  getData(true)
}
```

实现效果
<img src="https://i3.mjj.rip/2024/06/27/2d95cd53583750178abae7c8fc335de9.png" style="width:300px; margin: 0 auto;">
<!-- https://i3.mjj.rip/2024/06/27/2d95cd53583750178abae7c8fc335de9.png -->