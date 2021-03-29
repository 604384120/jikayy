import React, { useState, useEffect } from "react";
import { Divider, Tabs, Cascader } from "antd";
import { $, Page, Form, TablePagination, Modals, Inputs, Btn } from "../comlibs";
import Info from "./info";
// import OldCarsInfo from "./oldCarsInfo";

const { TabPane } = Tabs;

export default function() {
  let {infoOpen, tableList }={}

  useEffect(()=>{getQuery()},[]);

  async function getQuery(){
  };

	let columns = [
		{
			title: "序号",
			dataIndex: "_key"
		},
		{
      title: "申请人",
      // dataIndex: "company_name",
      dataIndex: "material",
      width: 300,
      render: (text, record) => (
				<span>{text?.verify_type === "PERSON" ? text?.name : text?.company_name}</span>
			)
		},
		{
			title: "状态",
      dataIndex: "process",
      render: rs => (
				<span>{rs === 'YES' ? '已处理' : '未处理'}</span>
			)
		},
		{
			title: "申请时间",
			dataIndex: "time_create"
		},
		{
			title: "操作",
			width: 170,
			align:'center',
			render: (text, record) => (
				<span>
					<a onClick={() => infoOpen.open("申请详情", record, {left: 300})}>查看</a>
					<Divider type="vertical" />
          {record.process === "YES" ? 
          <span style={{color: "#D9D9D9", fontSize: "12px", cursor: 'pointer'}} onClick={async () => {
            let res = await $.post("/service/app/unprocessed", {service_uuid: record.service_uuid});
            tableList.reload();
            $.msg("操作成功~");
            return res;
          }}>标记处理</span>: 
          <a
						onClick={async () => {
							let res = await $.post("/service/app/processed", {service_uuid: record.service_uuid});
							tableList.reload();
							$.msg("操作成功~");
							return res;
						}}
					>
						标记处理
					</a>}
				</span>
			)
		}
  ];

	return (
		<div className="br_3 bg_white pall_15">
      <Form className="mb_15" onSubmit={values => {
          tableList.search(values)
      }}>
        {({form, set})=>(
            <div className="dis_f jc_sb">
              <div className="box">
                <div className="h_40 mr_15 dis_ib">
                    <Inputs name="process" value="" form={form} select={[
                      {value:'', text:'全部状态'},
                      {value:'YES', text:'已处理'},
                      {value:'NO', text:'未处理'},
                    ]} autoSubmit/>
                </div>
              </div>
            </div>
        )}
      </Form>
      <TablePagination api="/service/app" columns={columns} ref={(rs) => tableList = rs} />
			<Page ref={(rs) => infoOpen = rs} onClose={() => tableList.reload()}>
        <Info />
			</Page>
		</div>
	);
}
