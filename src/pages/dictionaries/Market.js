import React, { useState, useEffect } from 'react';
import { Divider } from "antd";
import { $, Form, TablePagination, Modals, Inputs, Btn } from "../comlibs";

export default function() {
  let {addBrand, list}={}

  async function deleteData(record){
    await $.get('/marketcat/remove',{marketcat_uuid: record.marketcat_uuid});
    $.msg("操作成功~");
    list.reload();
  };

	let BrandModal = () => {
		return (
			<Modals ref={(rs) => addBrand = rs}>
        {(props) => {
          return <Form
            action={props ? "/marketcat/update" : "/marketcat/add"}
            params={{ marketcat_uuid:  props ? props.marketcat_uuid : undefined}}
            method="POST"
            success={() => {
              props ? $.msg("细分市场修改成功") : $.msg("细分市场添加成功");
              addBrand.close();
              list.reload();
            }}
          >
            {({ form, submit }) => (
              <div>
                <div style={{ marginLeft: 150 }} className="mt_15">
                  <Inputs
                    className="input_wrap"
                    form={form}
                    name="marketcat_name"
                    value={props ? props.marketcat_name : undefined}
                    required={true}
                    placeholder="请输入细分市场名称"
                  />
                </div>
                <div className="ta_c mt_15">
                  <Btn onClick={submit} />
                </div>
              </div>
            )}
          </Form>
        }}
			</Modals>
		);
  };

	let columns = [
		{
      title: "序号",
      
			dataIndex: "_key"
		},
		{
      title: "细分市场",
      width: 500,
      dataIndex: "marketcat_name",
		},
		{
			title: "操作",
			width: 170,
			align:'center',
			render: rs => (
				<span>
					<a onClick={() => addBrand.open("修改细分市场", rs)}>修改</a>
					<Divider type="vertical" />
          <a className="fc_err" onClick={() => deleteData(rs)}>删除</a>
				</span>
			)
		}
  ];

	return (
		<div className="br_3 bg_white pall_15">
      <Btn style={{marginTop: "-20px"}} onClick={() => addBrand.open("细分市场")}>添加细分市场</Btn>
      <TablePagination api="/marketcat/query" columns={columns} ref={(rs) => list = rs} />
      <BrandModal/>
		</div>
	);
}
