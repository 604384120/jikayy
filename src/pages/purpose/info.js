import React, { useState, useEffect } from "react";
import { Divider, Table } from "antd";
import { $, Page, Form, TablePagination, Modals, Inputs, Btn } from "../comlibs";

export default function(props) {
  let { Ref_1, Ref_2, Ref_3 } = $.useRef(3);
  let [parentData] = [props.Parent.data];
  let [infoData, setInfoData]=useState(null);
  let [show, setShow] = useState(false);
  
  let {
    carsInfo = new Map([
      ['品牌', 'brand_name'],
      ['车系', 'series_name'],
      ['单价(万)', 'price'],
      ['车型', 'car_model'],
      ['购车人', ['name', 'company_name', 'company_register']],
      ['联系人', ['name', 'company_name', 'company_register']],
      ['联系电话', 'phone'],
      ['分期意向', 'installment_num'],
      ['购车数量(辆)', 'num'],
      ['总价(万)', 'pay_amount'],
      ['融资项目', 'finance'],
      ['首付比例', 'down_payment'],
    ]),
  } = {}

  useEffect(()=>{getQuery()},[]);

  async function getQuery(){
    let res = await $.get('/intention/info', {intention_uuid: parentData.intention_uuid}, (err) => {
      if (err.message === '您没有该权限!') {
        return
      }
    });
    if(!res)return;
    setShow(true)
    setInfoData(res);
  };

	let columns = [
		{
			title: "时间",
			dataIndex: "time_create"
		},
		{
      title: "操作账号",
      dataIndex: "username"
		},
		{
			title: "内容",
			dataIndex: "content"
		},
  ];

  const creatCarInfo = () => {
    let row = [];
    let index = 0;
    let cols = [];
    let i = 0;
    if (infoData) {
      for (let [key, value] of carsInfo.entries()) {
        if (key === "购车人" || key === "联系人" || key === "联系电话") {
          if (infoData.material?.verify_type === "COMPANY") {//  COMPANY
            if (key === "购车人") value = infoData.material?.company_name;
            if (key === "联系人") value = infoData.material?.company_register;
          }
          if(infoData.material?.verify_type === "PERSON") {//  司机
            value = infoData.material?.name;
          }
          if(infoData.material?.verify_type === "VISITER") {//  访客
            value = infoData.material?.name;
          }
          if (key === "联系电话") {
            value = infoData.user?.phone;
          }
          cols.push(<div key={index} style={key === "车型" ? undefined : {width: 220}}><span>{key}</span>：{value}</div>)
        } else {
          cols.push(<div key={index} style={key === "车型" ? undefined : {width: 220}}><span>{key}</span>：{key === "分期意向" && !infoData[value] ? "不分期" : (infoData[value] || "无")}</div>)
        }
        if (index == 2 || key === "车型") {
          row[i] = <div className="dis_f jc_sb mv_15">{cols}</div>
          cols = []
          i ++
          index = 0
        } else {
          row[i] = <div className="dis_f jc_sb mv_15">{cols}</div>
          index ++;
        }
      }
    }
    return row
  };

	return (show &&
		<div className="br_3 bg_white pall_15">
      <div style={{paddingLeft: "24px"}}>
        {creatCarInfo()}
      </div>
      <Divider />
      <Form
					action="/intention/add/log"
					method="POST"
          className="login-form"
          params={{ intention_uuid: parentData.intention_uuid }}
					style={{ marginBottom: "10px" }}
					success={async() => {
            $.msg("保存成功！");
            getQuery();
					}}
				>
					{({ form, submit }) => (
						<div className="ph_24">
							<Inputs
                className="input_wrap mr_15"
                style={{width: "calc(100% - 100px)"}}
								form={form}
								name="content"
								required={true}
								rows={4}
								placeholder="请输入沟通记录"
								// value={data.memo}
							/>
              <Btn style={{marginTop: "50px"}} size="large" onClick={e => submit(e)}> 保存 </Btn>
						</div>
					)}
				</Form>
        <div className="fb mt_24 mb_24 mh_24">沟通记录：</div>
        <Table columns={columns} dataSource={infoData?.logs} pagination={false}/>
        <div style={{ position: 'absolute', right: 0, bottom: 0, width: '100%', borderTop: '1px solid #e9e9e9', padding: '10px 16px', background: '#fff', textAlign: 'left', }}><Btn htmlType="primary" onClick={() => props.Parent.close()}> 关闭 </Btn></div>
		</div>
	);
}
