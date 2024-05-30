import { getThemeConfig } from "./theme/utils/node";

export const themeConfig = getThemeConfig({
  // 作者
  author: "友人A",
  // 评论
  comment: {
    repo: "Niu-bin/blog",
    repoId: "R_kgDOLMBB5Q",
    category: "Announcements",
    categoryId: "DIC_kwDOLMBB5c4Cc-ci",
    inputPosition: "bottom",
  },
  // 友链
  friend: [
    {
      avatar: "https://avatars.githubusercontent.com/u/18414131?v=4",
      name: "白哥",
      desc: "前端路上贴心导师~",
      link: "https://github.com/xiumubai",
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/25240064?v=4",
      name: "王不留行",
      desc: "前端大佬 持续输出 技术分享~",
      link: "https://wyf195075595.github.io",
    },
  ],
});
