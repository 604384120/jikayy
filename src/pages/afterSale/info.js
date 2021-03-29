import React, { useState, useEffect } from "react";
import { Col, Row, Divider, Table } from "antd";
import { $, Page, Form, TablePagination, Modals, Inputs, Btn } from "../comlibs";

export default function(props) {
  let [parentData] = [props.Parent.data];
  let [infoData, setInfoData]=useState();
  let [show, setShow] = useState(false);
  
  let {
    carsInfo = new Map([
      ['申请人', 'company_name'],
      ['联系人', 'company_register'],
      ['联系电话', 'company_phone'],
      ['现有车辆(辆)', 'cnt_cars'],
    ]),
  } = {};

  useEffect(()=>{getQuery()},[]);

  async function getQuery(){
    let res = await $.get('/service/app/detail', {service_uuid: parentData.service_uuid}, (err) => {
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
    let index = 0;
    let cols = [];
    let span = 10;
    for (let [key, value] of carsInfo.entries()) {
      cols.push(<Col span={12} key={index++} className="dis_f mv_15">
        <span style={{display: "inline-block", width: '110px', textAlign: 'right'}}>{key}： </span>
        {infoData?.material[value]}
      </Col>)
    }
    return cols
  };

	return (show &&
		<div className="br_3 bg_white pall_15">
      <Row style={{paddingLeft: "24px"}}>
        {creatCarInfo()}
      </Row>
      <Divider />
      <Form
					action="/service/app/add/log"
					method="POST"
          className="login-form"
          params={{ service_uuid: parentData.service_uuid }}
					style={{ marginBottom: "10px" }}
					success={async() => {
            $.msg("保存成功！");
            getQuery()
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
								value={infoData?.content}
							/>
              <Btn style={{marginTop: "50px"}} size="large" onClick={e => submit(e)}> 保存 </Btn>
						</div>
					)}
				</Form>
        <div className="fb mb_24 mh_24 mt_30">沟通记录：</div>
        <Table columns={columns} dataSource={infoData?.logs} pagination={false}/>
      <div style={{ position: 'absolute', right: 0, bottom: 5, width: '100%', borderTop: '1px solid #e9e9e9', padding: '10px 16px', background: '#fff', textAlign: 'left', }}><Btn htmlType="primary" onClick={() => props.Parent.close()}> 关闭 </Btn></div>
		</div>
	);
}
