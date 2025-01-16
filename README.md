[更改日志](CHANGELOG.md)

## 开发者入门
1. git配置
   把当前仓库的git配置文件移动到.git目录的config中, 在当前项目中生效
```bash
cp .gitconfig .git/config
```
2. 提交规范
语法: 修复系统过于流畅的Bug
head: <type>: (<emoji>)<subject>
- type: feat: 新特性, fix: 修复, docs: 文档, style: 样式, refactor: 重构, test: 测试, chore: 其它
- emoji: 可选, 表情包
- subject: 从动词开始（比如“fix”），每行50个字符

   1. 提交的`类型`格式请参阅: [.versionrc.mjs](.versionrc.mjs) 文件, 例如: feat: 新特性, fix: 修复错误
   2. 提交的`表情包`请参阅: [.gitmessage](.gitmessage), 例如: :bug:
   3. 提交的`内容`, 例如: 修复系统过于流畅的Bug

示例:

- fix: 提交的类型
- :bug: 表情包
- 修复系统过于流畅的Bug: 提交的内容
```
fix: :bug: 修复系统过于流畅的Bug
```
