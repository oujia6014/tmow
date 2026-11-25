# T-MOW 1.4 交互原型（组合 B 高定控台 · 代码对齐版）

> 基于 `../prototype-1.3/` 与最新 Flutter 代码现状（`lib/`）构建。全目录静态自包含、无 `type="module"`，可直接双击或经本地 HTTP 浏览；未改动 `../prototype-1.3/` 与任何业务源码。

## 入口文件

| 文件 | 用途 |
|---|---|
| [index.html](index.html) | 主交互原型（单机形态 + 右侧评审工作台 + 1.4 / 1.3 / V1 三主题实时切换） |
| [flow.html](flow.html) | 全量业务泳道流程总览（含主题同步开关、按「已落代码 / 规划中 / 待确认」过滤） |
| [visual-preview.html](visual-preview.html) | 4 屏品牌视觉样板（启动展台 / 登录 / 定稿组合 B 首页 / 设置与 126 自检） |
| [home-pick.html](home-pick.html) | 首页重做挑选题（3 顶栏 + 底部悬浮/右侧浮钮 + 原版地图路径对比） |
| [home-variants.html](home-variants.html) | 早期首页去竞品化三方案对比存档 |
| [schedule-spec-review.html](schedule-spec-review.html) | 定时任务与工作记录对接规范评审参考页 |

## 视觉规范（Silver · Carbon · Pulse）

- **设计来源**：仅提炼 `assets/home/logo.png`（曜石黑 + 16° 斜切脉冲橙 `#F08300`）与冷银硬件实机渲染图（`device_product_large.png`、`device_selfcheck_product.png`），**已彻底弃用旧版 App 图标，登录与首页无 X5 机型角标**。
- **全浅色防雷同设计**：采用冷钛银与浅灰绿庭院底板（`#F2F5F2`）+ 瓷白控台面板（`#FFFFFF`）+ 3.5px 脉冲橙微光条；彻底去掉大片黑色区域。
- **首页定稿结构（组合 B）**：选型 3 品牌/设备合并顶栏（`TMOW | ● 设备名` + 右侧多设备/消息/设置方钮）→ 全画幅原版浅绿待割草地 + 白色割草实线 + 3px 深绿未闭合建图线 → 居中三键胶囊（定位 / 遥控 / 地图）+ 右侧错层双浮钮（刀盘 / 预约）→ 浅灰遥测条（`id:12` Wi-Fi + 电量）+ 双栏数据卡 + 左侧橙光条主 CTA；同时支持一键切换多设备列表对比视图。

## 1.4 代码对齐增量清单（1.4-1 ~ 1.4-8）

| 编号 | 模块 | 对齐的核心实现 |
|---|---|---|
| `1.4-1` | 登录与认证 | 密码/验证码双登录、注册账号、重置密码、登录前隐私政策摘要抽屉 |
| `1.4-2` | S3 / LoRa 三分支 | `X5 割草机` / `S3 通信配件` / `S3-X5 LoRa 配对` 三路向导、X5 扫码、S3 离线前置拦截、在线 S3 三选一弹窗（ADR-0008） |
| `1.4-3` | 首页控制与弹窗 | `fault bit7` 不可取消阻挡三出口弹窗（122/105/106）、`107` 回桩互斥选项弹窗、`id:12` 信号详情、`108` 对桩、`117` 远程关机 |
| `1.4-4` | 双模式遥控 | 手动控制支持「车体相对方向」与「地图绝对方向」切换（竖屏/横屏通用） |
| `1.4-5` | 真实 126 自检 | 4 大类 / 25 项位图诊断、X5 全息诊断台、无固定超时、`断连 · 结果待确认`、本地历史与清空 |
| `1.4-6` | 两阶段 OTA 门禁 | 下载→安装两阶段进度、`rebooting(8)`/`rollingBack(9)`/`checkFailed`、强制升级标志及 App 4 项安全前置校验 |
| `1.4-7` | 地图 114 与 5 态记录 | 地图列表「加载(114)」切换当前地图、云端删图失败补偿重试；工作记录补齐第 5 态 `PENDING_START（待开始）` |
| `1.4-8` | 设备信息与我的二级页 | MAC / 硬件版本 / 主控·MCU·视觉分模块固件；帮助与反馈、隐私说明、检查更新、系统权限、纯品牌关于页、一键清缓存 |

## URL Hash 直达示例

- `index.html#page=home&state=mowing&theme=14`
- `index.html#page=home&homeView=list`（多设备列表对照）
- `index.html#page=home&state=blocked`（`fault bit7` 阻挡三出口弹窗）
- `index.html#page=prov&provKind=lora&s3OnlineState=online`（S3 在线三选一弹窗）
- `index.html#page=selfcheck&ck=fatal`（126 自检 4 大类 25 项故障定位）
- `index.html#page=otaFw&otaPre=lowbat`（OTA 前置电量校验拦截）
