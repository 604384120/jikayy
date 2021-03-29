import React, { useState, useEffect } from "react";
import { Col, Row } from "antd";
import { $, Page, Form, TablePagination, Modals, Inputs, Btn } from "../comlibs";

export default function(props) {
  let [parentData] = [props.Parent.data];
  let [infoData, setInfoData]=useState(null);
  let [show, setShow] = useState(false);
  
  let {
    carsInfo = new Map([
      ['申请人', 'applicant_name'],
      ['身份证号码', 'applicant_cardid'],
      ['手机号码', 'applicant_phone'],
      ['收件地址', 'applicant_address'],
      ['身份证国徽页', 'applicant_idcard_front'],
      ['身份证人像页', 'applicant_idcard_back'],
    ]),
  } = {};

  useEffect(()=>{getQuery()},[]);

  async function getQuery(){
    let res = await $.get('/bankcard/applicant/detail', {user_uuid: parentData.user_uuid}, (err) => {
      if (err.message === '您没有该权限!') {
        return
      }
    });
    if(!res)return;
    setShow(true)
    setInfoData(res);
  };

  const creatCarInfo = () => {
    let index = 0;
    let cols = [];
    let span = 10;
    if (parentData) {
      for (let [key, value] of carsInfo.entries()) {
        if (key === '身份证国徽页' || key === '身份证人像页') {
          span=20
        }
        cols.push(<Col span={span} key={index++} className="dis_f mv_15">
          <span style={{display: "inline-block", width: '110px', textAlign: 'right'}}>{key}： </span>
          {key === '身份证国徽页' || key === '身份证人像页' ? <img width={280} height={150} src={parentData[value]}></img>: parentData[value]}
        </Col>)
      }
    }
    return cols
  };

	return (show &&
		<div className="br_3 bg_white pall_15">
      <Row style={{paddingLeft: "24px"}}>
        {creatCarInfo()}
      </Row>
      <div style={{ position: 'absolute', right: 0, bottom: 5, width: '100%', borderTop: '1px solid #e9e9e9', padding: '10px 16px', background: '#fff', textAlign: 'left', }}><Btn htmlType="primary" onClick={() => props.Parent.close()}> 关闭 </Btn></div>
		</div>
	);
}
