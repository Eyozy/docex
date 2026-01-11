# docex

隐私优先的文档图片提取工具，完全在浏览器本地运行。

[English](./README.md)

## ✨ 核心特性

- **100% 隐私安全**：所有处理过程均通过 Web Workers 在浏览器本地完成。您的数据永远不会离开您的设备。
- **广泛的格式支持**：
  - **Microsoft Office**: Word (`.docx`), PowerPoint (`.pptx`), Excel (`.xlsx`)
  - **Apple iWork**: Keynote (`.key`), Pages (`.pages`), Numbers (`.numbers`)
- **智能提取**：自动过滤图标、缩略图和占位符，只保留您真正需要的素材图片。
- **无损原图**：直接从文档结构中提取原始图像文件，无二次压缩，保持最高画质。
- **现代化 UI**：基于 Vue 3 和 Tailwind CSS 构建，支持深色模式。

## 🛠️ 技术栈

- **框架**: [Vue 3](https://vuejs.org/) (Composition API)
- **构建工具**: [Vite](https://vitejs.dev/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **核心库**: [JSZip](https://stuk.github.io/jszip/) (解析文档结构)
- **国际化**: [Vue I18n](https://vue-i18n.intlify.dev/)

## 🚀 快速开始

1.  **克隆仓库**

    ```bash
    git clone https://github.com/your-username/docex.git
    cd docex
    ```

2.  **安装依赖**

    ```bash
    npm install
    ```

3.  **启动开发服务器**

    ```bash
    npm run dev
    ```

4.  **构建生产版本**
    ```bash
    npm run build
    ```

## 📂 项目结构

```
src/
├── components/      # UI 组件 (拖拽区、画廊、预览)
├── composables/     # 业务逻辑 (useExtractor)
├── workers/         # Web Workers (文件解析与识别)
├── utils/           # 工具函数 (文件类型、MIME 类型)
├── types/           # TypeScript 类型定义
└── i18n/            # 多语言国际化
```

## 📄 许可证

基于 MIT 许可证开源。
