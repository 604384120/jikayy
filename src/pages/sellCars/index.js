import React, { useState, useEffect } from 'react';
import { Divider, Tabs, Cascader, Icon } from "antd";
import { $, Page, Form, TablePagination, Modals, Inputs, Btn } from "../comlibs";
import Add from "./add";
import OldCarsInfo from "./oldCarsInfo";

const { TabPane } = Tabs;

export default function() {
  let { Ref_1, Ref_2, Ref_3 } = $.useRef(3);
  let {tab, curTab = "newCars", newOpen, oldOpen, newList, oldList }={};
  
  let [brandList, setBrandList]=useState([]);
  let [marketcatList, setMarketcatList]=useState([]);

  useEffect(()=>{getQuery()},[]);

  async function getQuery(){
    let brandResList = await $.get('/brand/query', {cnt_totalnum: "NO"});
    let marketcatResList= await $.get('/marketcat/query', {cnt_totalnum: "NO"});
    if(!brandResList.data)return;
    if(!marketcatResList.data)return;
    let list1 = brandResList.data.map((node) => {node.label = node.brand_name; node.value = node.brand_uuid; node.children = node.seriess.map((ser) => {ser.label = ser.series_name; ser.value = ser.series_uuid; return ser} ); return node})
    let list2 = marketcatResList.data.map((node) => {node.value = node.marketcat_uuid; node.text = node.marketcat_name; return node})
    setBrandList(list1);
    setMarketcatList(list2);
  };

	let Reset = () => {
		return (
			<Modals ref={Ref_1}>
				{({ uuid, username }) => (
					<Form
						action="/oper/resetpwd"
						params={{ oper_uuid:uuid, username }}
						method="POST"
						success={() => {
							$.msg("帐号密码重置成功！");
							$(Ref_1).close();
						}}
					>
						{({ form, submit }) => (
							<div>
								<div style={{ marginLeft: 110 }}>帐号：{username}</div>
								<div style={{ marginLeft: 110 }} className="mt_15">
									密码：
									<Inputs
										className="input_wrap"
										form={form}
										name="passwd"
										required={true}
										placeholder="请输入密码"
									/>
								</div>
								<div className="ta_c mt_15">
									<Btn onClick={submit} />
								</div>
							</div>
						)}
					</Form>
				)}
			</Modals>
		);
	};

	let newColumns = [
		{
			title: "序号",
			dataIndex: "_key"
		},
		{
      title: "品牌",
      dataIndex: "brand_name"
		},
		{
			title: "车系",
			dataIndex: "series_name"
		},
		{
      title: "车型",
      dataIndex: "car_model"
		},
		{
      title: "价格",
      dataIndex: "price",
      render: (text, record) => {
        return <span>{text}万元</span>
      }
		},
		{
			title: "库存量(辆)",
      dataIndex: "inventory",
      render: (text) => {
        return <span>{text}辆</span>
      }
		},
		{
			title: "状态",
      dataIndex: "onsell",
      render: (text) => {
        return <span>{text === "YES" ? "售卖中" : "已停售"}</span>
      }
		},
		{
			title: "操作",
			width: 170,
			align:'center',
			render: (text, record) => (
				<span>
					<a onClick={() => newOpen.open("编辑", {...record, type: "set"})}>编辑</a>
					<Divider type="vertical" />
					<a
						onClick={async () => {
              let api = "/truck/onsell";
              record.onsell === "YES" && (api = "/truck/offsell");
              let res = await $.post(api, {truck_uuid: record.truck_uuid});
							newList.reload();
							$.msg("操作成功~");
							return res;
						}}
					>
						{record.onsell === "YES" ? "停售" : "在售"}
					</a>
					<Divider type="vertical" />
          <a 
            className="fc_err"
            onClick={async () => {
            let res = await $.get("/truck/remove", {truck_uuid: record.truck_uuid});
            newList.reload();
            $.msg("操作成功~");
            return res;}}>删除</a>
				</span>
			)
		}
  ];
  
	let oldColumns = [
		{
			title: "序号",
      dataIndex: "_key"
		},
		{
      title: "品牌",
      dataIndex: "brand_name",
      render: (text, record) => <span><a onClick={() => oldOpen.open("二手车详情", record)}>{text}</a></span>
		},
		{
			title: "车系",
			dataIndex: "series_name"
		},
		{
			title: "车型",
      dataIndex: "car_model",
		},
		{
			title: "价格",
      dataIndex: "price",
      render: rs => <span>{rs}万元</span>
		},
		{
			title: "发布人",
      dataIndex: "material",
      render: rs => <span>{rs?.name}</span>
		},
  ];

	return (
		<div className="br_3 bg_white pall_15">
      <Tabs
        defaultActiveKey={curTab}
        onChange={(e) => {
          curTab = e;
          // if (e === "oldCars") {
          //   oldOpen && oldOpen.reload();
          // }
        }}
      >
        <TabPane tab="新车" key="newCars">
          <Form className="mb_15"
            onSubmit={values => {
              values.brand_uuid = values.brandData[0];
              values.series_uuid = values.brandData[1];
              newList.search(values);
            }}>
            {({form, set})=>{
                return (<div className="dis_f jc_sb">
                  <div className="box">
                    <div className="h_40 mr_15 dis_ib">
                        {set({
                            name: 'brandData',
                        },(valSet)=>(
                            <Cascader options={brandList} onChange={() => {
                              let _set = setTimeout(() => {
                                form._handleSubmit({});
                                clearTimeout(_set);
                              }, 50);
                          }} placeholder="全部品牌/车系" />
                        ))}
                    </div>
                    <div className="h_40 mr_15 dis_ib">
                        <Inputs name="onsell" value="" type="select" form={form} select={[
                            {value:'',text:'全部'},
                            {value:'YES',text:'在售'},
                            {value:'NO',text:'停售'},
                        ]} autoSubmit={true} />
                    </div>
                    <Inputs
                      form={form}
                      name="car_model"
                      className="mr_10"
                      placeholder="请输入车型名称"
                    />
                    <Btn htmlType="submit" icon="search">
                      搜索
                    </Btn>
                  </div>
                  <div>
                    <Btn onClick={() => newOpen.open("添加车辆")}>添加车辆</Btn>
                  </div>
                </div>)
            }}
          </Form>
          <TablePagination api="/truck/query" columns={newColumns} ref={(rs) => newList = rs} />
        </TabPane>
        <TabPane tab="二手车" key="oldCars">
          <Form className="mb_15" onSubmit={values => {
              values.brand_uuid = values.brandData[0];
              values.series_uuid = values.brandData[1];
              oldList.search(values)
          }}>
            {({form, set})=>(
                <div className="dis_f jc_sb">
                  <div className="box">
                    <div className="h_40 mr_15 dis_ib">
                      {set({
                          name: 'brandData',
                      },(valSet)=>(
                          <Cascader options={brandList} onChange={() => {
                            let _set = setTimeout(() => {
                              form._handleSubmit({});
                              clearTimeout(_set);
                            }, 50);
                        }} placeholder="全部品牌/车系" />
                      ))}
                    </div>
                    <Inputs
                    form={form}
                    name="car_model"
                    className="mr_10"
                    placeholder="请输入车型名称"
                  />
                  <Btn htmlType="submit" icon="search">
                    搜索
                  </Btn>
                  </div>
                  <div>
                    <Btn onClick={async btn => {
                      let status = false;
                      $.store().GlobalData.user.permissions.forEach((node) => {
                        if (node.name === "在售车辆") {
                          node.permissions.forEach((item) => {
                            if (item.permission_name === '导出二手车信息' && item.permission === 'ON') {
                              status = true
                            }
                          })
                        }
                      });
                      if (status) {
                        await $.download("/export/old/truck/intention", {totalnum: "NO"});
                        btn.setloading(false, 5000);
                      } else {
                        return $.msg('当前账号没有导出权限')
                      }
                    }}
                    >导出二手车信息</Btn>
                  </div>
                </div>
            )}
          </Form>
          <TablePagination api="/old/truck/query" columns={oldColumns} ref={(rs) => oldList = rs} />
        </TabPane>
      </Tabs>
			<Reset />
			<Page ref={(rs) => newOpen = rs} onClose={() => newList.reload()}>
				<Add brandList={brandList} marketcatList={marketcatList} />
			</Page>
			<Page ref={(rs) => oldOpen = rs} onClose={() => oldList.reload()}>
				<OldCarsInfo />
			</Page>
		</div>
	);
}
