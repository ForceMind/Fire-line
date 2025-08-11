
# Fire-line

# Fire-line

火线突击（Fire-line）是一款基于 HTML5 Canvas 的轻量级射击游戏，支持单人、AI对战、局域网联机等多种模式。

## 主要特性
- WASD/触屏移动，鼠标/触屏瞄准，支持移动端自适应
- 多种武器、手雷、烟雾弹、回血、弹药补给
- AI 敌人/队友，支持自由混战、生存、团队等模式
- 局域网联机，支持房间发现、加入、玩家同步、名字显示
- 现代化 UI，支持全屏、横屏、虚拟摇杆

## 快速开始
1. 克隆仓库到本地
2. 使用支持 HTML5 的浏览器直接打开 `index.html`
3. （可选）运行 `server.js` 启动局域网联机服务

## 运行局域网联机
1. 安装 Node.js
2. 启动服务端：
   ```
   node server.js
   ```
3. 浏览器访问 `index.html`，自动发现/加入房间

## 许可证
本项目采用 MIT License，详见 LICENSE 文件。

---

Made with ❤️ by ForceMind
## 游戏模式
- **自由混战（FFA）**：击败所有敌人。
- **波次生存（Survival）**：存活并清理每一波敌人。
- **2v2 小队**：与 AI 队友协作对抗敌队。

## 角色介绍
- **疾影**：速度快 / 生命低 / 初始武器：冲锋枪
- **突击**：均衡 / 中等生命 / 初始武器：步枪
- **重装**：速度慢 / 生命高 / 初始武器：霰弹枪

## 使用方法
1. 克隆仓库：
   ```sh
   git clone https://github.com/ForceMind/Fire-line.git
   ```
2. 进入项目目录：
   ```sh
   cd Fire-line
   ```
3. 用浏览器直接打开 `index.html` 文件即可游玩。

## 贡献指南
欢迎提交 issue 和 pull request 以改进本项目。

## 许可证
请补充许可证信息（如 MIT、Apache-2.0 等）。
