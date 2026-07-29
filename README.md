# HKU CDS 选课指南

港大 CDS 学院 ECIC 专业选课参考站，收录 ICOM / ECOM / FITE / COMP 四类课程的往届评价。

🌐 线上地址：https://HXHOvO.github.io/hku-cds-courses/

## 功能

- **课程评价**：按编号、英文名、中文名搜索，查看每门课的标签与学长姐评价
- **选课小助手**：按标签筛选（无考勤、无期末考试等），给课程打分并自动排序

打分数据只存在使用者自己的浏览器里，不上传、不共享、不记录。

## 本地开发

```bash
npm install
npm run dev
```

## 更新课程数据

课程数据在 `src/data/courses.ts`，直接编辑后 push 到 main 分支即可，GitHub Actions 会自动重新部署。

> 管理口令在 `src/data/config.ts`。注意：这是纯前端项目，口令只是防止误触，不是真正的安全措施。

## 技术栈

React 19 · TypeScript · Vite · Tailwind CSS v4
