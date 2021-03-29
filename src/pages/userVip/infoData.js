import React, { useState, useEffect } from 'react';
import { Row, Col } from "antd";
import { $, Btn, Modals, Form, Inputs } from "../comlibs";

export default function(props) {

  let [infoData, setInfoData]=useState({});
  let [material, setMaterial]=useState(new Map([]));
  let [verify_type, setVerify_type]=useState("");

  useEffect(()=>{getQurey()},[]);

  let {addBrand} = {};

  async function getQurey(){
    let res= await $.get('/user/info', {user_uuid: props.Parent.data.user_uuid});
    if(!res)return;
    let verify_material = res.verify_material;
    let type = verify_material?.verify_type ? verify_material?.verify_type : res.verify_type;
    setVerify_type(type)
    setInfoData(res);
    if (type === "VISITER") {// 访客
      setMaterial(new Map([
        ['会员状态', "未认证"],
        ['会员类型', "访客"],
        ['注册日期', res?.time_create],
        ['微信昵称', res?.user_name],
        ['注册手机号', res?.phone],
      ]))
    } else if (type === "COMPANY") {//  企业
      setMaterial(new Map([
        ['会员状态', verify_material?.verify === "YES" ? "已认证" : (infoData?.verify === "NO" ? "未认证," : "待认证")],
        ['会员类型', "车队"],
        ['注册日期', verify_material?.time_create],
        ['企业名称', verify_material?.company_name],
        ['企业法人', verify_material?.legal_person],
        ['企业地址', verify_material?.company_area_name + verify_material?.company_address],
        ['企业联系人', verify_material?.company_register],
        ['联系人岗位', verify_material?.company_post],
        ['联系人电话', verify_material?.company_phone],
        ['工作邮箱', verify_material?.company_email],
        ['现有车辆', `${verify_material?.cnt_cars}辆`],
        ['微信昵称', res?.user_name],
        ['注册手机号', res?.phone],
        ['营业执照', verify_material?.company_license],
      ]))
    } else if (type === "PERSON") {// 司机
      setMaterial(new Map([
        ['会员状态', verify_material?.verify === "YES" ? "已认证" : (infoData?.verify === "NO" ? "未认证," : "待认证")],
        ['会员类型', "司机"],
        ['注册日期', verify_material?.time_create],
        ['司机姓名', verify_material?.name],
        ['微信昵称', res?.user_name],
        ['注册手机号', res?.phone],
        ['身份证号', verify_material?.idcard],
        ['性别', verify_material?.gender],
        ['出生年月', verify_material?.birthday],
        ['现住地址', verify_material?.current_area_name + verify_material?.current_address],
        ['户籍所在地', verify_material?.domicile_name],
        ['工作年限', verify_material?.job_years],
        ['驾驶证', [verify_material?.driver_license_1, verify_material?.driver_license_2]],
      ]))
    }
  };

  async function handelVerify(type){
    if (type === "cancel") {
      await $.post('/user/material/cancel',{material_uuid: infoData.verify_material.material_uuid});
    } else {
      await $.post('/user/material/verify',{material_uuid: infoData.verify_material.material_uuid});
    }
    props.Parent.setCloseData(true)
    $.msg("操作成功~");
    getQurey();
  };

  let BrandModal = () => {
		return (
			<Modals ref={(rs) => addBrand = rs}>
        <Form
          onSubmit={async (values, btn, ext) => {
            values.material_uuid = infoData.verify_material.material_uuid;
            let rs = await $.post("/user/material/fail", values);
            $.msg("操作成功");
            addBrand.close();
            props.Parent.setCloseData(true)
            btn.loading = false;  //关闭提交按钮loading加载状态
            props.Parent.close();
            props.Parent.data.tableList.reload()
          }}
        >
          {({ form, submit }) => (
            <div>
              <div className="mt_15">
                驳回理由：
                <Inputs
                  style={{width: "calc(100% - 100px)"}}
                  rows={4}
                  form={form}
                  type="textArea"
                  name="reason"
                  required={true}
                  placeholder="请输入理由"
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

  const creatCarInfo = () => {
    let row = [];
    let index = 0;
    let cols = [];
    let i = 0;
    let creatDom = (index, key, value) => {
      return <Col span={8} key={index}><span>{key+"："}{value}</span></Col>
    }
    for (let [key, value] of material.entries()) {
      
      if (key === "企业地址" || key === "营业执照" || key === "驾驶证") {
        if (cols.length > 0) {
          row[i] = <Row style={{margin: "12px 0"}}>{cols}</Row>
          i ++
          cols = []
        }
        if (key === "营业执照") {
          row[i] = <Row style={{margin: "12px 0"}}><Col span={16} key={index} style={{height: "100px"}}><span>{key+"："}</span><img src={value} style={{width: "calc(100% - 120px)", height: "220px", marginLeft: "40px", display: "inline-block"}}></img></Col></Row>
        } else if (key === "驾驶证") {
          row[i] = <Row style={{margin: "12px 0"}}>
            <Col span={24} key={index} style={{height: "100px"}}>
              <span>{key+"："}</span>
              <div style={{display: "inline-block", width: "calc(100% - 100px)"}}><img src={value[0]} style={{width: "50%", height: "220px", paddingRight: "10px"}}></img>
              <img src={value[1]} style={{width: "50%", height: "220px", paddingLeft: "10px"}}></img></div>
            </Col>
          </Row>
        } else {
          row[i] = <Row style={{margin: "12px 0"}}>{creatDom(index, key, value)}</Row>
        }
        i ++
        index = 0
      } else if (key != "企业地址" && index == 2) {
        
        cols.push(creatDom(index, key, value))
        row[i] = <Row style={{margin: "12px 0"}}>{cols}</Row>
        i ++
        index = 0
        cols = []
      } else {
        cols.push(creatDom(index, key, value))
        row[i] = <Row style={{margin: "12px 0"}}>{cols}</Row>
        index ++
      }
    }
    return row
  };

  const creatBtn = () => {
    if (verify_type === "VISITER") {
      return <div>
          <Btn type="primary" style={{marginRight: "15px"}} onClick={() => props.Parent.close()}> 关闭 </Btn>
        </div>
    } else {
      if (infoData.verify === "YES") {
        return <div>
          <Btn type="default" style={{marginRight: "15px"}} onClick={() => props.Parent.close()}> 关闭 </Btn>
          <Btn type="primary" onClick={() => handelVerify("cancel")}>取消认证</Btn>
        </div>
      } else {
        return <div>
            <Btn type="default" style={{marginRight: "15px"}} onClick={() => props.Parent.close()}> 关闭 </Btn>
            <Btn type="default" style={{marginRight: "15px"}} onClick={() => addBrand.open("驳回理由")}> 驳回 </Btn>
            <Btn type="primary" onClick={() => handelVerify("verify")}>认证</Btn>
          </div>
      }
    }
  }

	return (
		infoData && <div>
      {creatCarInfo()}
        <div style={{ position: 'absolute', right: 0, bottom: 10, width: '100%', borderTop: '1px solid #e9e9e9', padding: '10px 16px', background: '#fff', textAlign: 'left', }}>
          {creatBtn()}
        </div>
        <BrandModal/>
		</div>
	);
}
