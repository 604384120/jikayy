import React, { useState, useEffect } from "react";
import { Col, Row, Divider, Table, Checkbox } from "antd";
import { $, Page, Form, TablePagination, Modals, Inputs, Btn } from "../comlibs";

export default function(props) {
  let [parentData] = [props.Parent.data];
  let [infoList, setInfoList]=useState();

  useEffect(()=>{getQuery()},[]);

  async function getQuery(){
    let res = await $.get('/oper/detail', {oper_uuid: parentData.uuid});
    if(!res)return;
    let data = res.oper;
    setInfoList(res.oper.permissions);
  };

  let columns = [
		// {
		// 	title: "序号",
		// 	dataIndex: "_key"
		// },
		{
      title: "菜单",
      dataIndex: "name"
		},
		{
			title: "权限",
      dataIndex: "permissions",
      render: (text, record) => {
        return text.map((node, index) => {
          return <Checkbox key={index} checked={node.permission === 'ON'} onChange={ async (e) => {
            let api = e.target.checked ? '/oper/permission/enable' : '/oper/permission/disable';
            let res = await $.post(api, {oper_uuid: parentData.uuid, permission_code: node.permission_code})
            $.msg('操作成功~')
            getQuery()
            }} >{node.permission_name}</Checkbox>
        })
      }
		},
  ];

	return (
		<div className="br_3 bg_white pall_15">
      <div style={{float: "left"}}><span>姓名：</span>{parentData.name}</div>
      <div style={{float: "left", marginLeft: 20}}><span>登录账号：</span>{parentData.username}</div>
      <Divider />
      <Table columns={columns} dataSource={infoList} pagination={false}/>
      <div style={{ position: 'absolute', right: 0, bottom: 5, width: '100%', borderTop: '1px solid #e9e9e9', padding: '10px 16px', background: '#fff', textAlign: 'left', }}>
        <Btn htmlType="primary" onClick={() => props.Parent.close()}> 确定 </Btn>
      </div>
		</div>
	);
}
