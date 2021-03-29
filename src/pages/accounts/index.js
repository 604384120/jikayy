import React from "react";
import { Divider } from "antd";
import { $, Form, TablePagination, Modals, Inputs, Btn, Page } from "../comlibs";
import Permissions from "./permissions"

export default function() {
  let { tableList, addBrand, series, permissions }={}

	let BrandModal = () => {
		return (
			<Modals ref={(rs) => addBrand = rs}>
        <Form
          action="/oper/add"
          method="POST"
          success={() => {
            $.msg("账号添加成功");
            addBrand.close();
            tableList.reload();
          }}
        >
          {({ form, submit }) => (
            <div>
              <div style={{ marginLeft: 110 }} className="mt_15">
                账号：
                <Inputs
                  className="input_wrap"
                  form={form}
                  name="username"
                  required={true}
                  placeholder="请输入账号"
                />
              </div>
              <div style={{ marginLeft: 110 }} className="mt_15">
                姓名：
                <Inputs
                  className="input_wrap"
                  form={form}
                  name="name"
                  required={true}
                  placeholder="请输入姓名"
                />
              </div>
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
			</Modals>
		);
  };
  
	let SeriesModal = () => {
		return (
			<Modals ref={(rs) => series = rs}>
				{({ uuid }) => (
					<Form
            onSubmit={async (values, btn, ext) => {
              //values: 表单数据
              //btn: 触发表单提交事件的按钮实例
              //ext: 提交按钮传递过来的额外数据
              let verfy = (text) => {
                $.warning(text)
                btn.loading = false;  //关闭提交按钮loading加载状态
                return
              }
              if (values.passwd !== values.verifyPasswd) {
                verfy("两次密码输入不一致")
                return
              }
              if (values.passwd.length < 8) {
                verfy("请输入8位以上密码")
                return
              }
              values.oper_uuid = uuid
              let rs = await $.post("/oper/resetpwd", values);
              $.msg("密码修改成功");
              series.close();
              btn.loading = false;  //关闭提交按钮loading加载状态
              tableList.reload()
            }}
					>
						{({ form, submit }) => (
							<div>
								<div style={{ marginLeft: 110 }} className="mt_15">
                  新密码：
									<Inputs
										className="input_wrap"
										form={form}
										name="passwd"
										required={true}
										placeholder="请输入新密码"
									/>
								</div>
								<div style={{ marginLeft: 82 }} className="mt_15">
                  确认新密码：
									<Inputs
										className="input_wrap"
										form={form}
										name="verifyPasswd"
										required={true}
										placeholder="请输入确认新密码"
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

	let columns = [
		{
			title: "账号",
      dataIndex: "username",
      width: 220
		},
		{
      title: "姓名",
      dataIndex: "name",
		},
		{
      title: "状态",
      dataIndex: "status",
      render: (text, record) => {
        if (text === "DISABLE") {
          return <div><span style={{color: "#F5222D", paddingRight: "10px"}}>●</span>禁用</div>
        } else {
          return <div><span style={{color: "#52C41A", paddingRight: "10px"}}>●</span>启用</div>
        }
      }
		},
		// {
    //   title: "备注",
    //   dataIndex: "remark",
		// },
		{
			title: "操作",
			width: 170,
			align:'center',
			render: (text, record) => {
        if (record.username === "admin") {
          return (<span>-</span>)
        } else {
          return (<span>
            <a onClick={() => series.open("重置密码", record)}>重置密码</a>
            <Divider type="vertical" />
            <a
              onClick={async () => {
                let api = "/oper/disable";
                record.status === "DISABLE" && (api = "/oper/enable");
                let res = await $.post(api, {oper_uuid: record.uuid});
                tableList.reload();
                $.msg("操作成功~");
                return res;
              }}
            >
              {record.status === "DISABLE" ? "启用" : "禁用"}
            </a>
            <Divider type="vertical" />
            <a onClick={() => permissions.open("权限", record, {left: 200})}>权限</a>
          </span>)
        }
    }}
  ];

	return (
		<div className="br_3 bg_white pall_15">
      <Btn className="mv_15" onClick={() => addBrand.open("添加账号")}>添加账号</Btn>
      <TablePagination api="/oper/list" columns={columns} ref={(rs) => tableList = rs} />
      <BrandModal/>
			<SeriesModal />
      <Page ref={(rs) => permissions = rs} onClose={() => tableList.reload()}>
        <Permissions/>
      </Page>
		</div>
	);
}
