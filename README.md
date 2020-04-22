# 矿小助

:smile:这款小程序以方便校园生活、:laughing:服务同学为宗旨，集课表查看、教务查询、一卡通查询等功能于一体，:heart_eyes:更有矿大头像戳、圣诞头像戳等小工具。

:+1:小程序设计美观，版面清晰，内容丰富，不管是Android还是iOS都适用，不受系统限制！



接下来，小程序即将增加校车、校历、电费等功能，用户将可进行校园网一键连，任意增添删改课表，随时查看任课教师联系方式等等……应同学要求，小程序还会上线“校园社区”功能——一个只属于矿大同学的朋友圈！

## 矿小助请求接口

使用promise风格的回调

## 矿小助实现功能

#### 1.教务查询

包括课表，考试和成绩

#### 2.一卡通

一卡通余额查询，一卡通流水差查询，一卡通余额充值

#### 3.天气

高德API查询徐州天气

~~根据天气显示不同背景~~

#### 4.数据可视化

账单的月开销和开销分布： 

学期课程进度和地点分布:

​		使用echarts进行饼图和折线图统计

### 用户体验

~~根据判断白天（夜晚），显示今日课程（明日课程），小程序背景图片白天（黑夜）~~

暂未找到合适的背景图片

借鉴colorUi，清爽的UI界面

### 优化相关

##### 1.对某个特别耗时的请求，采用预加载

将某个promise请求在进入页面前挂在到App上

进入页面后拿到这个promise调用then方法

用户余额查询和流水都采取了预加载



#### 预览

![img](https://github.com/CaiyueDamowang/CUMT-helper/blob/master/img/preview)

![img](https://github.com/CaiyueDamowang/CUMT-helper/blob/master/img/preview1)

![img](https://github.com/CaiyueDamowang/CUMT-helper/blob/master/img/preview2)





## TODO-LIST

:nail_care:用户交互操作反馈

:star:UI界面美化

:white_check_mark::star:课程统计

:white_check_mark: :star:账单统计

:white_check_mark: :star:优化网络请求



