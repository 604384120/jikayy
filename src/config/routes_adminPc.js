module.exports = [
	/*
	 * 管理员端路由
	 * path: 路由浏览器地址
	 * name: 路由中文名
	 * icon: 路由图标，详情：https://ant.design/components/icon-cn/
	 * component: 根目录pages目录下路由文件地址
	 * sublist： 伪二级路由，对应为左侧主菜单的子菜单，注意：当没有子菜单时值必须为空数组
	 * type: 路由类型，暂时只支持设置index、404
	 */

	{
		name: "在售车辆",
		icon: "icon-car",
		path: "/adminPc/sellCars",
    component: "/sellCars/index",
		type: "index",
		sublist: []
	},
	{
		name: "购车意向",
		icon: "icon-buy",
		path: "/adminPc/purpose",
		component: "/purpose/index",
		sublist: []
	},
	{
		name: "招聘信息",
		icon: "icon-jobInfo",
		path: "/adminPc/join",
		component: "/join/index",
		sublist: []
	},
	{
		name: "会员管理",
		icon: "icon-accounts",
		path: "/adminPc/userVip",
		component: "/userVip/index",
		sublist: []
	},
	{
		name: "熊锚卡",
		icon: "icon-card",
		path: "/adminPc/pandaCard",
		component: "/pandaCard/index",
		sublist: []
	},
	{
		name: "车后服务",
		icon: "icon-afterSale",
		path: "/adminPc/afterSale",
		component: "/afterSale/index",
		sublist: []
	},
	{
		name: "banner管理",
		icon: "icon-banner",
		path: "/adminPc/banner",
		component: "/banner/index",
		sublist: []
	},
	{
		name: "数据字典",
		icon: "icon-dict",
		path: "/adminPc/dictionaries",
		component: "/dictionaries/index",
		sublist: []
	},
	{
		name: "运营账号",
		icon: "icon-userVip",
		path: "/adminPc/accounts",
		component: "/accounts/index",
		sublist: []
	},
	{
		path: "/adminPc/404",
		name: "页面不存在",
		type: "404",
		hide: true,
		component: "/other/404",
		sublist: []
	},
	{
		path: "/adminPc/test",
		name: "test",
		hide: true,
		component: "/other/test",
		sublist: []
	},
];
