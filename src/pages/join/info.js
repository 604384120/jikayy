import React, { useState, useEffect } from "react";
import { Tag, Tabs, Divider, Row, Col, Menu } from "antd";
import { $, Page, Form, TablePagination, Modals, Inputs, Btn } from "../comlibs";
import "./index.css";
import { nodeName } from "jquery";

const { TabPane } = Tabs;
const { SubMenu } = Menu;

export default function(props) {
  let { Ref_1, Ref_2, Ref_3 } = $.useRef(3);
  let [parentData] = [props.Parent.data];
  let [infoData, setInfoData] = useState(null);
  let [resumeList, setResumeList] = useState([]);
  let [resumeKey, setResumeKey] = useState(0);
  let [show, setShow] = useState(false);
  
  let {
    carsInfo = new Map([
      ['品牌', 'value'],
      ['车系', 'value'],
      ['单价', 'value'],
      ['车型', 'value'],
      ['购车人', 'value'],
      ['联系人', 'value'],
      ['联系电话', 'value'],
      ['融资项目', 'value'],
      ['购车数量', 'value'],
      ['总价', 'value'],
      ['分期意向', 'value'],
      ['首付比例', 'value'],
    ]),
    joinTab,
  } = {}

  useEffect(()=>{getQuery()},[]);

  async function getQuery(){
    let res = await $.get('/job/detail', {job_uuid: parentData.job_uuid}, (err) => {
      if (err.message === '您没有该权限!') {
        return
      }
    });
    if(!res)return;
    setInfoData(res);
    res = await $.get('/resume/query', {job_uuid: parentData.job_uuid}, (err) => {
      if (err.message === '您没有该权限!') {
        return
      }
    });
    if(!res)return;
    setShow(true)
    setResumeList(res.data)
  };

  const creatResumeMenu = () => {
    return resumeList?.map((item, index) => {
      return <Menu.Item key={index + ''} style={{height: '100px'}}>
      <div>
        <p><span>{item.material.name+" "+item.material.gender}</span></p>
        <p><span>{item.education}</span><Divider type="vertical" /><span>{item.age}岁</span><Divider type="vertical" /><span>{item.drive_age}年驾龄</span></p>
      </div>
    </Menu.Item>
    })
  };

  const creatResumeInfo = () => {
    if (resumeList.length === 0) {
      return
    }
    let data = resumeList[resumeKey]
      return (<div style={{display: "inline-block", paddingLeft: "20px"}}>
      <div style={{marginBottom: "20px"}}>
        <span style={{fontWeight: "bold", fontSize: "24px", lineHeight: "60px"}}>{data.material.name+" "+data.material.gender}</span>
        <p><span>{data.education}</span><Divider type="vertical" /><span>{data.age}岁</span><Divider type="vertical" /><span>{data.drive_age}年驾龄</span></p>
        <p>
          <span style={{display: "inline-block", width: "240px"}}>联系电话：{data.user?.phone || "无"} </span>
          <span style={{display: "inline-block", width: "240px"}}>驾驶证类型：{data.drive_license || "无"} </span>
          <span style={{display: "inline-block", width: "240px"}}>薪资要求：{`${data.min_salary}~${data.max_salary}` || "无"}</span>
        </p>
        <p>福利要求：{data?.welfare?.map((item, index) => {
          return <span key={index} className="mr_10"> { item || "无" } </span>
        })} </p>
      </div>
      <div style={{marginBottom: "20px"}}>
        <p className="title">原工作信息</p>
        <p className="ph_16">工作地址：{data.job_address || "无"}</p>
        <p className="ph_16">驾驶车辆型号：{data.truck_model || "无"}</p>
        <p className="ph_16">驾驶路线：{data.drive_line || "无"}</p>
      </div>
      <div style={{marginBottom: "20px"}}>
        <p className="title">意向工作信息</p>
        <p className="ph_16">工作地址：{data.intent_job_address || "无"}</p>
        <p className="ph_16">驾驶车辆型号：{data.intent_truck_model || "无"}</p>
        <p className="ph_16">驾驶路线：{data.intent_drive_line || "无"}</p>
      </div>
      <div style={{marginBottom: "20px"}}>
        <p className="title">其他要求：</p>
        <p className="ph_16">{data.else_require || "无"}</p>
      </div>
    </div>)
  };

	return (show &&
		<div className="br_3 bg_white pall_15">
      <Tabs
        defaultActiveKey={joinTab}
        onChange={(e) => {
          joinTab = e;
          // if (e === "oldCars") {
          //   oldOpen && oldOpen.reload();
          // }
        }}
      >
        <TabPane tab="招聘信息" key="join">
          <div className="item1">
            <div className="item1-1">{infoData?.job_name} <span>{infoData?.job_type_name}</span></div>
            <div className="mb_10"><span style={{color: "#FF6427", paddingRight: "4px"}}>{infoData?.min_salary}~{infoData?.max_salary}</span> | 
            {/* 驾龄{infoData?.drive_age}年以上/ */}
            {infoData?.drive_license}</div>
            <div className="mb_4">企业：{infoData?.material?.company_name}</div>
            <div>地址：{infoData?.material?.company_area_name + infoData?.material?.company_address}</div>
          </div>
          <div className="itemBox">
            <div className="title" >工作地址</div>
            <div className="ph_16">{infoData?.job_address}</div>
          </div>
          <div className="itemBox">
            <div className="title">工作内容</div>
            <div className="ph_16" dangerouslySetInnerHTML={{__html: String(infoData?.job_content).replace(/[\r\n]/g, '<br/>')}}></div>
          </div>
          <div className="itemBox">
            <div className="title">运营线路</div>
            <div className="ph_16">{infoData?.drive_line}</div>
          </div>
          <div className="itemBox">
            <div className="title">驾驶车辆</div>
            <div className="ph_16">{infoData?.truck_model}</div>
          </div>
          <div className="itemBox">
            <div className="title">任职要求</div>
            <div className="ph_16" dangerouslySetInnerHTML={{__html: String(infoData?.job_require).replace(/[\r\n]/g, '<br/>')}}></div>
          </div>
          <div className="itemBox">
            <div className="title">福利待遇</div>
            <div className="ph_16">{
              infoData?.welfare.map((item, index) => {
                return <span style={{padding: "2px 8px", backgroundColor: "#F4F5F6", marginRight: "10px"}}> {item || "无"} </span>
              })
            }</div>
          </div>
        </TabPane>
        <TabPane tab="应聘信息" key="apply">
          <Menu style={{ width: 256, float: "left" }} mode="inline" defaultSelectedKeys={['0']} onClick={(e) => setResumeKey(parseInt(e.key))}>
            {creatResumeMenu()}
          </Menu>
          {creatResumeInfo()}
        </TabPane>
      </Tabs>
		</div>
	);
}
