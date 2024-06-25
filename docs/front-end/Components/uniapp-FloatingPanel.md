---
category: 组件
cover: https://cdn.pixabay.com/photo/2023/07/13/06/59/canyon-8124036_1280.jpg
---

# uniapp floating-panel

## 封装浮动板组件

### 引言

为了解决仿高德地图首页三段滑动效果封装一个滑动面板组件,但是在封装组件之前我在网上查找封装思路,发现uniapp插件以及其相关组件库并没有类似的组件
,后来在[mobail atd](https://mobile.ant.design/zh/)中找到了浮动面板,于是仿照他的功能来封装uniapp组件

### 思路

#### 模版布局

应为我需要的是一个面板它包含头部也就是需要按住拖动的位置,还有一个就是面板主体这个主体的高度会随着拖动距离改变,明确这个我们就开始动手

```ts
<template>
  <view
    :class="['floating-panel', { stop: isStopMove }]"
    :style="{
      transform: `translateY(calc(100% - ${position + baseHeight}px))`,
    }"
  >
    <view
      :id="panelHeaderId"
      class="floating-panel-header"
      :style="[borderRadius]"
      @touchmove.stop="panelMoving($event)"
      @touchstart.stop="panelMoveStart"
      @touchend.stop="panelMoveEnd"
    >
      <view class="floating-panel-bar" />
    </view>
    <view
      v-if="handleDraggingOfContent"
      class="floating-panel-content"
      @touchmove.stop="panelMoving($event)"
      @touchstart.stop="panelMoveStart"
      @touchend.stop="panelMoveEnd"
    >
      <slot />
    </view>
    <view v-else class="floating-panel-content">
      <slot />
    </view>
  </view>
</template>

```

所得布局形状为

<img src="https://i3.mjj.rip/2024/06/26/339d30ff217c516df5c971c1f103e718.png" style="width:200px; margin: 0 auto;">

css样式处理

```ts
<style lang="scss" scoped>
.floating-panel {
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 95vh;
  bottom: 0;
  left: 0;
  touch-action: none; //防止浏览器默认行为 拖动滑块组件页面跟随滑动
  &.stop {
    transition: transform 0.3s;
  }

  &-header {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    height: 58rpx;
    cursor: grab; //该变鼠标形状为抓手
    user-select: none; //禁止选择元素文本
    background-color: #fff;
    border-bottom: 2rpx solid #d6d7d9;
  }

  &-bar {
    height: 6rpx;
    width: 40rpx;
    border-radius: 10px;
    background: #ccc;
  }

  &-content {
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #fff;
  }
}
</style>

```

js逻辑处理

```ts

<script>
// 浮动面板 [参考https://mobile.ant.design/zh/components/floating-panel]
export default {
  name: "FloatingPanel",
  data() {
    return {
      position: 0, //top位置
      isStopMove: false, //是否停止移动
      currentIndex: 0,
      panelHeaderId: `panel-header-${uni.$u.guid(6)}`,
    };
  },

  props: {
    // 面板头部的圆角
    radius: {
      type: [Number, String],
      default: 32,
    },
    // 锚点位置 支持数字(%),px,rpx
    anchors: {
      type: Array,
      default: [30, 50, 90],
    },
    // 面板内容区域是否可拖动
    handleDraggingOfContent: {
      type: Boolean,
      default: false,
    },
    // 高度变化回调
    onHeightChange: {
      type: Function,
      default: null,
    },
    // 基础高度(被tab-bar遮住时使用)
    baseHeight: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    borderRadius() {
      const radius = uni.$u.addUnit(this.radius, "rpx");
      return {
        "border-top-left-radius": radius,
        "border-top-right-radius": radius,
      };
    },
  },
  mounted() {
    this.currentHeight = 0;
    const { windowHeight } = uni.getSystemInfoSync(); //获取屏幕高度
    this.windowHeight = windowHeight;
    // 计算锚点区域(去重)
    const anchorAreas = [
      ...new Set(
        this.anchors
          .flatMap((anchor) => {
            const pxValue = this.getPx(anchor, windowHeight);
            if (pxValue === null) return [];
            return [pxValue];
          })
          .sort((a, b) => a - b)
      ),
    ]; //改为升序

    this.anchorAreas = anchorAreas;
    this.$uGetRect(`#${this.panelHeaderId}`).then((e) => {
      //如果最后一个锚点大于最大高度,则等于最大高度;
      let maxHeight;
      uni.getSystemInfo({
        success: (res) => {
          // X及以上的异形屏top为44，非异形屏为20
          if (res.safeArea.top <= 20) {
            // console.log("8以下");
            maxHeight = windowHeight * 0.83 + e.height; //85vh+header的高度
          } else {
            // console.log("刘海瓶");
            maxHeight = windowHeight * 0.9 + e.height; //90vh+header的高度
          }
        },
      });

      const lastLength = anchorAreas.length - 1;
      if (anchorAreas[lastLength] > maxHeight) {
        anchorAreas[lastLength] = maxHeight;
      }

      // 初始化数据
      this.headerHeight = e.height;
      this.setCurrentHeight(this.currentIndex);
      this.position = this.currentHeight;
      this.firstPosition = anchorAreas[0];
      this.lastPosition = anchorAreas[lastLength];
    });
  },
  methods: {
    // px转换
    getPx(anchor, baseNumber = 0) {
      let pxValue = +anchor;
      if (Number.isNaN(pxValue)) {
        // 不可转数字的字符串
        const { groups } = /^(?<rpx>\d+(\.\d+)?)rpx$/.exec(anchor) || {};
        if (groups) {
          pxValue = groups.rpx / 2; //rpx=>px
        } else {
          const result = parseInt(anchor); //px=>px
          pxValue = Number.isNaN(result) ? null : result; //px转换失败返回null
        }
      } else {
        pxValue = (baseNumber * pxValue) / 100; // % =>px
      }
      if (pxValue !== null) pxValue = +pxValue.toFixed(2); //保留两位小数
      return pxValue;
    },
    useFunction(callback, ...params) {
      if (callback instanceof Function) callback(...params);
    },
    getCurrentHeight(index = this.currentIndex) {
      return this.anchorAreas[index];
    },
    setCurrentHeight(index) {
      const currentHeight = this.getCurrentHeight(index);
      if (currentHeight === undefined) return;
      this.currentHeight = currentHeight;
      this.emitGetHeight(currentHeight);
    },
    panelMoving({ touches = [] } = {}) {
      if (this.anchorAreas.length <= 1) return;
      const { pageY } = touches[0];
      const moveY = pageY - this.startY;
      const position = this.anchorPosition - moveY;
      // 未触发边界距离则可移动
      if (position > this.firstPosition && position < this.lastPosition) {
        this.position = position; //移动
        this.pervMoveY = moveY; //记录移动
        this.useFunction(this.onHeightChange, moveY, position);
      }
    },
    panelMoveStart({ touches = [] } = {}) {
      if (this.anchorAreas.length <= 1) return;
      clearTimeout(this.timeout);
      this.emitGetHeight(this.lastPosition);
      const { pageY } = touches[0];
      this.startY = pageY; //记录开始位置
      this.isStopMove = false; //修改stop样式
      this.anchorPosition = this.position; //锚定
    //   this.nextHeight = this.getCurrentHeight(this.currentIndex + 1);
    },
    panelMoveEnd() {
      if (this.anchorAreas.length <= 1) return;
      this.startY = 0; //移除移动开始记录
      this.anchorPosition = 0; //移除锚点距离
      this.pervMoveY = 0; //移除移动记录
      this.isStopMove = true; //修改stop样式
      const endIndex = this.anchorAreas.findIndex((h) => h >= this.position);
      const nextArea = this.anchorAreas[endIndex];
      const prevArea = this.anchorAreas[endIndex - 1] || 0;
      const diff = prevArea + (nextArea - prevArea) / 2; //计算两个区间的中间位置
      this.position = this.position > diff ? nextArea : prevArea; //判断上靠上还是靠下
      this.timeout = setTimeout(() => this.emitGetHeight(this.position), 300);
    },
    emitGetHeight(height) {
      if (height === undefined || height === null) return;
      this.$emit("getHeight", height - this.headerHeight);
    },
  },
  watch: {
    currentIndex(index) {
      this.setCurrentHeight(index);
    },
  },
};
</script>

```

以上就是完整代码

使用demo

```ts

<template>
  <view class="page">
    <floating-panel
      :anchors="[30, 60, 90]"
      @getHeight="setScrollViewHeight"
      :baseHeight="60"
    >
      <scroll-view :style="{ height: scrollViewHeight + 'px' }" scroll-y="true">
        <view class="message" v-for="(k, index) of 10" :key="k"
          >我是一条消息{{ index }}</view
        >
      </scroll-view>
    </floating-panel>

    <u-tabbar
      :value="value6"
      @change="(name) => (value6 = name)"
      :fixed="true"
      :placeholder="true"
      :safeAreaInsetBottom="true"
    >
      <u-tabbar-item text="首页" icon="home"></u-tabbar-item>
      <u-tabbar-item text="放映厅" icon="photo"></u-tabbar-item>
      <u-tabbar-item text="直播" icon="play-right"></u-tabbar-item>
      <u-tabbar-item text="我的" icon="account"></u-tabbar-item>
    </u-tabbar>
  </view>
</template>

<script>
export default {
  data() {
    return {
      value6: 0,
      scrollViewHeight: 0,
    };
  },
  methods: {
    setScrollViewHeight(height) {
      //最大高度
      this.scrollViewHeight = height;
    },
  },
};
</script>

<style lang="scss">
.page {
  width: 100vw;
  height: 100vh;
  background-color: #f5f5f5;
}

.message {
  background-color: cyan;
  padding: 24rpx;
  font-size: 30rpx;
  color: #fff;
}
</style>


```

