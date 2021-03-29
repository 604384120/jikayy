import React, { useState, useEffect } from "react";
import { Divider } from "antd";
import { $, Page, Form, TablePagination, Modals, Inputs, Btn } from "../comlibs";
import Info from "./info";

export default function() {
  let { Ref_1, Ref_2, Ref_3 } = $.useRef(3);
  let {tab, curTab = "newCars", infoOpen, oldOpen, infoData, oldList, tableList }={}

  let [infoVisible, setInfoVisible] = useState(false);

	let columns = [
		{
			title: "序号",
			dataIndex: "_key"
		},
		{
      title: "名称",
      width: 220,
      render: (text, record) => {
        return <span>{record.material?.name}</span>
      }
		},
		{
			title: "微信昵称",
			dataIndex: "user_name"
		},
		{
      title: "类型",
      dataIndex: "verify_type",
			render: (text, record) => {
        if (record.material.verify_type) {
          if (record.material.verify_type === "VISITER") {
            return <span>访客</span>
          } else if (record.material.verify_type === "COMPANY") {
            return <span>车队</span>
          } else if (record.material.verify_type === "PERSON") {
            return <span>司机</span>
          }
        } else {
          return <span>访客</span>
        }
      }
		},
		{
      title: "认证状态",
      dataIndex: "verify",
			render: (text, record) => {
        if (record.material.verify) {
          if (record.material.verify === "YES") {
            return <span style={{color: "#52C41A", paddingRight: "10px"}}>● 已认证</span>
          } else if (record.material.verify === "VISITER") {
            return <span style={{color: "#BFBFBF", paddingRight: "10px"}}>● 未认证</span>
          } else if (record.material.verify === "NO") {
            return <span style={{color: "#1890FF", paddingRight: "10px"}}>● 待认证</span>
          }
        } else {
          return <span style={{color: "#BFBFBF", paddingRight: "10px"}}>● 未认证</span>
        }
      }
		},
		{
			title: "注册日期",
			dataIndex: "time_update"
		},
		{
			title: "操作",
			align:'center',
			render: rs => (
				<a onClick={() => infoOpen.open("会员详情", {...rs, tableList}, {left: 100})}>查看</a>
			)
		}
  ];

	return (
		<div className="br_3 bg_white pall_15">
      <Form className="mb_15" onSubmit={values => {
          tableList.search(values)
      }}>
        {({form})=>(
            <div className="dis_f jc_sb">
              <div className="box">
                <div className="h_40 mr_15 dis_ib">
                    <Inputs name="verify_type" value="" form={form} select={[
                        {value:'',text:'全部会员'},
                        {value:'COMPANY',text:'车队'},
                        {value:'PERSON',text:'司机'},
                        {value:'VISITER',text:'访客'}
                    ]} autoSubmit={true}/>
                </div>
                <div className="h_40 mr_15 dis_ib">
                    <Inputs name="verify" value="" form={form} select={[
                        {value:'',text:'全部状态'},
                        {value:'YES',text:'已认证'},
                        {value:'NO',text:'待认证'},
                        {value:'FAILURE',text:'未认证'},
                    ]} autoSubmit={true}/>
                </div>
              </div>
            </div>
        )}
      </Form>
      <TablePagination api="/user/query" columns={columns} ref={(rs) => tableList = rs} />
			<Page ref={(rs) => infoOpen = rs} onClose={() => tableList.reload()}>
        <Info/>
			</Page>
		</div>
	);
}
