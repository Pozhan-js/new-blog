---
category: 合并table
cover: https://cdn.pixabay.com/photo/2023/07/13/06/59/canyon-8124036_1280.jpg
---

# 使用elementPlus中的table合并

需要实现的效果

<img src="https://i3.mjj.rip/2024/06/26/907d31a95bf75fb5fe751f7638fdd54f.png" style="width:300px; margin: 0 auto;">

## 使用思路

使用elementPlus组件库中的table实现其合并功能,在其组件中有属性`span-method`,传递一个方法接受一个对象,对象里面包含 `row`(当前行的数据) , `column`(当前列的数据) ,  `rowIndex`(行的index[0,0]) , `columnIndex`(列的index[0,0]) 等四个属性

参考文档中的使用实例

先模拟传递参数
```ts

import type { TableColumnCtx } from 'element-plus'
interface User {
  id: number
  title: string
  content: string
  score: number
}

interface SpanMethodProps {
  row: User
  column: TableColumnCtx<User>
  rowIndex: number
  columnIndex: number
}

let data: User[] = [
  {
    id: 2,
    title: '创意创新(30分)',
    content:
      '方案创新性:是面向数据应用场景中的某一具体问题或缓解提出的解决方案,且搜友提出的方案具有创新性和有效性',
    score: 10,
  },
  {
    id: 3,
    title: '创意创新(30分)',
    content:
      '技术创新性:应用场景业务特点突出情况.在全省乃至全国范围.业务领域内具有创新性.引领性.首创性情况',
    score: 10,
  },
  {
    id: 1,
    title: '方案完整性',
    content: '方案完全符合模版要求,完整,逻辑缜密',
    score: 10,
  },
  {
    id: 4,
    title: '创意创新(30分)',
    content:
      '完整明确:你解决的问题是什么,你的解决方案是什么,你的解决方案如何解决问题,你的解决方案的优势是什么',
    score: 10,
  },
  {
    id: 5,
    title: '技术能力(40分)',
    content:
      '技术多样性,综合运用5G,人工智能,大数据,区块链等技术,技术应用广泛,技术应用深度,技术应用广度',
    score: 10,
  },
  {
    id: 6,
    title: '技术能力(40分)',
    content: '技术安全性:具备应用安全和数据安全保障机制并良好运行',
    score: 10,
  },
  {
    id: 7,
    title: '技术能力(40分)',
    content:
      '技术优势:结合应用场景.详细说明作品设计的算法和技术实现方案,采用算法.开发技术的先进与创新性',
    score: 10,
  },
  {
    id: 8,
    title: '技术能力(40分)',
    content: '运维能力:数据应用的运维运营,升级迭代.推广运行方面实施情况',
    score: 10,
  },
  {
    id: 9,
    title: '应用价值(20分)',
    content: '项目落地:项目应具备落地实施场景及实施情况',
    score: 10,
  },
  {
    id: 10,
    title: '应用价值(20分)',
    content: '示范带动效应:做平的预期应用成果,对行业发展的示范带动效应',
    score: 10,
  },
]

```

这里解释一下数据定义: 这里的`id`方便定义数据的唯一性以及后面对数据排列顺序整理,`title`用来判断那些数据是需要合并的(具有相同的title的数据会进行合并),`score`定义为number类型方便后面的合计

```ts
const arraySpanMethod = ({
  row,
  column,
  rowIndex,
  columnIndex,
}: SpanMethodProps) => {
  if (rowIndex % 2 === 0) {
    if (columnIndex === 0) {
      return [1, 2]
    } else if (columnIndex === 1) {
      return [0, 0]
    }
  }
}

const objectSpanMethod = ({
  row,
  column,
  rowIndex,
  columnIndex,
}: SpanMethodProps) => {
  if (columnIndex === 0) {
    if (rowIndex % 2 === 0) {
      return {
        rowspan: 2,
        colspan: 1,
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0,
      }
    }
  }
}

```

在elementPlus中提供了两个方法,在这里我使用objectSpanMethod方法来做合并,

1. 这里先将后端返回给我们的数据进行处理,这里需考虑后端给我们的数据不一定是按顺序的,所以我们这里需要现将数据进行相同`title`提纯

```ts

const myCallback = (item: User) => {
  return item.title
}

// 工具函数整理数据
const dataGroupBy = (arr: User[]) => {
  let resultArr = [] as User[]
  result = Object.groupBy(arr, myCallback)
  Object.keys(result).forEach((key) => {
    resultArr = [...resultArr, ...(result[key] as User[])]
  })

  return resultArr.sort((a, b) => a.id - b.id)
}

这里我们使用Object.groupBy方法来进行相同title提取再将其根据id排序

```

2. 将数据赋值给table `const tableData = dataGroupBy(data)`
3. 使用方法来进行合并

```ts

const objectSpanMethod = ({
  row,
  column,
  rowIndex,
  columnIndex,
}: SpanMethodProps) => {
  if (columnIndex === 0) {
    if (rowIndex > 0 && row.title === tableData[rowIndex - 1].title) {
      // 当前行的title与前一行相同，则合并行
      return { rowspan: 0, colspan: 0 }
    } else {
      // 当前行的title与前一行不同，则计算当前行的title在数组中的索引
      const index = tableData.findIndex((item) => item.title === row.title)
      // 从当前行开始向下查找，直到找到title不同的行为止
      let rowspan = 1
      for (let i = index + 1; i < tableData.length; i++) {
        if (tableData[i].title === row.title) {
          rowspan++
        } else {
          break
        }
      }
      return { rowspan, colspan: 1 }// 这表示会将后面的相同title的第一列进行合并
    }
  }
}


```