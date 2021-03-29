import React, { useState, useEffect } from "react";
import { Divider, Cascader } from "antd";
import { $, Page, Form, TablePagination, Modals, Inputs, Btn } from "../comlibs";
import Info from "./info";
import Item from "antd/lib/list/Item";

export default function() {
  let {infoOpen, infoList }={}

	let columns = [
		{
			title: "序号",
			dataIndex: "_key"
		},
		{
      title: "岗位名称",
      dataIndex: "job_name"
		},
		{
			title: "发布企业",
      dataIndex: "material",
      render: rs => <span>{rs?.company_name}</span>
		},
		{
      title: "投递人数",
      dataIndex: "cnt_resume",
		},
		{
      title: "招聘状态",
      dataIndex: "enable",
			render: rs => <span>{rs === "YES" ? "进行中" : "已结束"}</span>
		},
		{
			title: "发布时间",
			dataIndex: "time_create"
		},
		{
			title: "操作",
			width: 170,
			align:'center',
			render: (text, record) => (
				<span>
					<a onClick={() => infoOpen.open("招聘详情", record)}>查看</a>
				</span>
			)
		}
  ];

	return (
		<div className="br_3 bg_white pall_15">
      <Form className="mb_15" onSubmit={values => {
          infoList.search(values)
      }}>
        {({form, set})=>(
            <div className="dis_f jc_sb">
              <div className="box">
                <div className="h_40 mr_15 dis_ib">
                    <Inputs name="enable" value="" form={form} autoSubmit select={[
                      {value:'',text:'全部状态'},
                      {value:'YES',text:'进行中'},
                      {value:'NO',text:'已结束'},
                    ]}/>
                </div>
                <Btn onClick={async btn => {
                  let status = false;
                  // console.log($.store().GlobalData.user)
                  $.store().GlobalData.user.permissions.forEach((node) => {
                    if (node.name === "招聘信息") {
                      node.permissions.forEach((item) => {
                        if (item.permission_name === '导出信息' && item.permission === 'ON') {
                          status = true
                        }
                      })
                    }
                  });
                  if (status) {
                    await $.download("/export/resumes", {totalnum: "NO"});
                    btn.setloading(false, 5000);
                  } else {
                    return $.msg('当前账号没有导出权限')
                  }
                }}
                >导出招聘信息</Btn>
              </div>
            </div>
        )}
      </Form>
      <TablePagination api="/job/query" columns={columns} ref={(rs) => infoList = rs} />
			<Page ref={(rs) => infoOpen = rs} onClose={() => infoList.reload()}>
        <Info />
			</Page>
		</div>
	);
}
