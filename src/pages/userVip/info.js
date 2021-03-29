import React, { useState, useEffect } from "react";
import { Form as Forms, Button, Select, Cascader, InputNumber } from "antd";
import { Method, Form, Inputs, Uploadimgs, Btn, Modals } from "../comlibs";
import { optionsList } from "../../common/plugins/cityData";
import "./index.css"
 
const { Option } = Select;
export default function(props) {
  let $ = new Method();
  const Iconfont = $.icon();
  let parent = props.Parent.data;
  let {img_ref, marketcatDs = false} = {};
  let [infoData, setInfoData]=useState({});
  let [verify, setVerify]=useState();
  let [verify_type, setVerify_type]=useState("");
  let [disable, setDisable]=useState(false);

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
      setDisable(true)
    } else {
      setVerify(res.verify_material.verify)
      if (res.verify_material.verify === 'NO') {
        setDisable(true)
      }
    }
  };

  async function handelVerify(type){
    if (type === "cancel") {
      await $.post('/user/material/cancel',{material_uuid: infoData.verify_material.material_uuid});
    } else {
      await $.post('/user/material/verify',{material_uuid: infoData.verify_material.material_uuid});
      setDisable(false)
    }
    props.Parent.setCloseData(true)
    $.msg("操作成功~");
    getQurey();
  };

  const addressVal = (zonecode) => {
    let a,b,c;
    let code;
    if (zonecode % 10000 === 0) {
      code = [zonecode]
    } else if (zonecode % 100 === 0) {
      a = zonecode.slice(0, 2)
      b = zonecode.slice(2, 4)
      code = [a * 10000, (a + '' + b) * 100]
    } else if (zonecode % 1 === 0) {
      a = zonecode.slice(0, 2)
      b = zonecode.slice(2, 4)
      c = zonecode.slice(4, 6)
      code = [(a * 10000).toString(), ((a + '' + b) * 100).toString(), a + '' + b + c]
    }
    return code;
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
  
  let AvatarBox = (props) => {
    let imgs = props?.imgs || "";
    let [avatar,setAvatar] = useState(imgs);
    let {valSet}=props;
    let {
      uploadimgs,
      url = "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/9cf01460-fc79-11ea-ae54-00163e0e1996.png"
    }={};
    return (
        <div className="box box-ver box-ac box-pc imgBox mb_10">
            {avatar ? <img style={{width:400,height:220}} src={avatar}/> :
                <img style={{width:400,height:220}} src={url}/>}
            {!disable && <Button type='primary' onClick={()=>{ uploadimgs.open() }}>重新上传</Button>}
            <Uploadimgs
              multiple={false}
              prefix={props.type === "brand_logo" ? 'newtruck/' : "seriescover/"}
              ref={e => (uploadimgs = e)}
              onSure={cover => {
                valSet(cover)
                setAvatar(cover)
      }}
    />
        </div>
    )
  };

  const creatBtn = (submit) => {
    if (verify_type === "VISITER") {
      return <div>
          <Btn type="primary" style={{marginRight: "15px"}} onClick={() => props.Parent.close()}> 关闭 </Btn>
        </div>
    } else {
      if (infoData.verify === "YES") {
        return <div>
          <Btn type="default" className='mr_15' onClick={() => props.Parent.close()}> 关闭 </Btn>
          <Btn type="primary" className='mr_15' onClick={() => handelVerify("cancel")}>取消认证</Btn>
          <Btn type="primary" onClick={submit}>保存并修改</Btn>
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
		<div className="br_3 pall_15">
			<Form
        style={{width: "970px", margin: "0 auto"}}
				onSubmit={async (values, btn, ext) => {
          console.log(values)
          values.user_uuid = props.Parent.data.user_uuid
          if (values.company_area) {
            values.company_area = values.company_area[values.company_area.length-1]
          }
          if (values.current_area) {
            values.current_area = values.current_area[values.current_area.length-1]
          }
          if (values.domicile) {
            values.domicile = values.domicile[values.domicile.length-1]
          }
          if (verify_type === "COMPANY") {
            let rs = await $.post('/user/cmaterial/update', values, () => {
              btn.loading = false;
            });
            $.msg("企业认证资料修改成功！");
          } else {
            let rs = await $.post('/user/pmaterial/update', values, () => {
              btn.loading = false;
            });
            $.msg("司机认证资料修改成功！");
          }
          props.Parent.close(true);
          return;
				}}
			>
				{({ form, submit, set }) => {
					return (<div>
            <div className="bg_white pall_15 mb_20">
              <Forms.Item>
                <span style={{marginLeft: "30px", display: "inline-block", width: "100px",textAlign: "right"}}>会员状态： </span>
                <span style={{display: "inline-block", width: '150px'}}>{verify === "YES" ? "已认证" : (verify === "NO" ? "待认证" : "未认证")}</span>
                <span style={{marginLeft: "30px", display: "inline-block", width: "100px",textAlign: "right"}}>会员类型： </span>
                <span style={{display: "inline-block", width: '150px'}}>{verify_type === "COMPANY" ? "车队" : (verify_type === "PERSON" ? "司机" : "访客")}</span>
                <span style={{marginLeft: "30px", display: "inline-block", width: "100px",textAlign: "right"}}>注册日期： </span>
                <span style={{display: "inline-block"}}>{verify_type === "VISITER" ? infoData?.time_create : infoData?.verify_material?.time_create}</span>
              </Forms.Item>
              {verify_type === "COMPANY" ? <div>
                <Forms.Item>
                  <span style={{marginLeft: "30px", display: "inline-block", width: "100px",textAlign: "right"}}>企业名称： </span>
                  {disable ? <span style={{display: 'inline-block', width: '430px'}}>{infoData?.verify_material?.company_name}</span> :
                  <Inputs style={{ width: 150 }} form={form} name="company_name" value={infoData?.verify_material?.company_name}/>}
                  <span style={{marginLeft: "30px", display: "inline-block", width: "100px",textAlign: "right"}}>企业法人： </span>
                  <Inputs style={{ width: 150 }} disabled={disable} form={form} name="legal_person" value={infoData?.verify_material?.legal_person}/>
                </Forms.Item>
                <Forms.Item>
                  <span style={{display: "inline-block", width: "130px",textAlign: "right"}}>企业地址： </span>
                  {disable ? <span>{infoData?.verify_material?.company_area_name + infoData?.verify_material?.company_address}</span> :
                  <div style={{display: "inline-block", width: "620px"}}>
                    {set({
                        name: 'company_area',
                        value: infoData ? addressVal(infoData?.verify_material?.company_area + "") : undefined,
                        // required: true
                    },(valSet)=>(
                      <Cascader
                        style={{width: "220px"}}
                        fieldNames={{ label: 'name', value: 'code', children: 'sub' }}
                        disabled={disable}
                        options={optionsList}
                        // onChange={(value, selectedOptions) => }
                        // changeOnSelect
                        placeholder="请选择地址"
                      />
                    ))}
                    <Inputs className="ml_15" style={{ width: 300 }} disabled={disable} form={form} name="company_address" value={infoData?.verify_material?.company_address} />
                  </div>}
                </Forms.Item>
                <Forms.Item>
                  <span style={{marginLeft: "30px", display: "inline-block", width: "100px",textAlign: "right"}}>企业联系人： </span>
                  <Inputs style={{ width: 150 }} disabled={disable} form={form} name="company_register" value={infoData?.verify_material?.company_register}/>
                  <span style={{marginLeft: "30px", display: "inline-block", width: "100px",textAlign: "right"}}>联系人岗位： </span>
                  <Inputs style={{ width: 150 }} disabled={disable} form={form} name="company_post" value={infoData?.verify_material?.company_post}/>
                  <span style={{marginLeft: "30px", display: "inline-block", width: "100px",textAlign: "right"}}>联系人电话： </span>
                  <Inputs style={{ width: 150 }} disabled={disable} form={form} name="company_phone" value={infoData?.verify_material?.company_phone}/>
                </Forms.Item>
                <Forms.Item>
                  <span style={{marginLeft: "30px", display: "inline-block", width: "100px",textAlign: "right"}}>工作邮箱： </span>
                  <Inputs style={{ width: 150 }} disabled={disable} form={form} name="company_email" value={infoData?.verify_material?.company_email}/>
                  <span style={{marginLeft: "30px", display: "inline-block", width: "100px",textAlign: "right"}}>现有车辆： </span>
                  <Inputs style={{ width: 150 }} disabled={disable} form={form} name="cnt_cars" value={infoData?.verify_material?.cnt_cars}/>
                  <span style={{marginLeft: "30px", display: "inline-block", width: "100px",textAlign: "right"}}>微信昵称： </span>
                  <Inputs style={{ width: 150 }} disabled={true} form={form} name="user_name" required={true} value={infoData?.user_name}/>
                </Forms.Item>
                <Forms.Item>
                  <span style={{marginLeft: "30px", display: "inline-block", width: "100px",textAlign: "right"}}>注册手机号： </span>
                  <Inputs style={{ width: 150 }} disabled={true} form={form} name="phone" required={true} value={infoData?.phone}/>
                </Forms.Item>
                <div style={{ marginLeft: 68 }} className="mt_15">
                  营业执照：
                  {set({
                      name: 'company_license',
                      value: infoData?.verify_material?.company_license,
                  },(valSet)=>(
                      // <AvatarBox img_ref={ref => {img_ref = ref}} valSet={valSet} imgs={infoData?.verify_material?.company_license}/>
                      <AvatarBox img_ref={ref => {img_ref = ref}} valSet={valSet} imgs={infoData?.verify_material?.company_license} />
                  ))}
                </div>
              </div> : 
              (verify_type === "PERSON" ? <div>
                <Forms.Item>
                  <span style={{marginLeft: "30px", display: "inline-block", width: "100px",textAlign: "right"}}>司机名称： </span>
                  <Inputs style={{ width: 150 }} disabled={disable} form={form} name="name" value={infoData?.verify_material?.name}/>
                  <span style={{marginLeft: "30px", display: "inline-block", width: "100px",textAlign: "right"}}>微信昵称： </span>
                  <Inputs style={{ width: 150 }} disabled={true} form={form} name="user_name" value={infoData?.user_name}/>
                  <span style={{marginLeft: "30px", display: "inline-block", width: "100px",textAlign: "right"}}>注册手机号： </span>
                  <Inputs style={{ width: 150 }} disabled={true} form={form} name="phone" value={infoData?.phone}/>
                </Forms.Item>
                <Forms.Item>
                  <span style={{marginLeft: "30px", display: "inline-block", width: "100px",textAlign: "right"}}>身份证号： </span>
                  <Inputs style={{ width: 150 }} disabled={disable} form={form} name="idcard" value={infoData?.verify_material?.idcard}/>
                  <span style={{marginLeft: "30px", display: "inline-block", width: "100px",textAlign: "right"}}>性别： </span>
                  <Inputs style={{ width: 150 }} disabled={true} form={form} name="gender" value={infoData?.verify_material?.gender}/>
                  <span style={{marginLeft: "30px", display: "inline-block", width: "100px",textAlign: "right"}}>出生年月： </span>
                  <Inputs style={{ width: 150 }} disabled={true} form={form} name="birthday" value={infoData?.verify_material?.birthday}/>
                </Forms.Item>
                <Forms.Item>
                  <span style={{display: "inline-block", width: "130px",textAlign: "right"}}>现住地址： </span>
                  {disable ? <span>{infoData?.verify_material?.current_area_name + infoData?.verify_material?.current_address}</span> :
                  <div style={{display: "inline-block", width: "620px"}}>
                    {set({
                        name: 'current_area',
                        value: infoData ? addressVal(infoData?.verify_material?.current_area + "") : undefined,
                        // required: true
                    },(valSet)=>(
                      <Cascader
                        style={{width: "220px"}}
                        disabled={disable}
                        fieldNames={{ label: 'name', value: 'code', children: 'sub' }}
                        options={optionsList}
                        // onChange={(value, selectedOptions) => }
                        // changeOnSelect
                        placeholder="请选择地址"
                      />
                    ))}
                    <Inputs className="ml_15" style={{ width: 300 }} disabled={disable} form={form} name="current_address" value={infoData?.verify_material?.current_address} />
                  </div>}
                </Forms.Item>
                <Forms.Item>
                  <span style={{display: "inline-block", width: "130px",textAlign: "right"}}>户籍所在地： </span>
                  {disable ? <span style={{display: "inline-block", width: "430px"}}>{infoData?.verify_material?.domicile_name}</span> :
                  <div style={{display: "inline-block", width: "430px"}}>
                    {set({
                        name: 'domicile',
                        value: infoData ? addressVal(infoData?.verify_material?.domicile + "") : undefined,
                        // required: true
                    },(valSet)=>(
                      <Cascader
                        style={{width: "220px"}}
                        disabled={disable}
                        fieldNames={{ label: 'name', value: 'code', children: 'sub' }}
                        options={optionsList}
                        // onChange={(value, selectedOptions) => }
                        // changeOnSelect
                        placeholder="请选择地址"
                      />
                    ))}
                  </div>}
                  <span style={{marginLeft: "30px", display: "inline-block", width: "100px",textAlign: "right"}}>工作年限： </span>
                  {disable ? <Inputs style={{ width: 150 }} disabled={true} form={form} name="user_name" value={infoData?.verify_material?.job_years}/> :
                  set({
                        name: 'job_years',
                        value: infoData?.verify_material?.job_years,
                    },(valSet)=>(
                      <InputNumber style={{ width: 150 }} disabled={disable} form={form} min={0} max={99}/>
                    ))}
                </Forms.Item>
                <div style={{ marginLeft: 84 }} className="mt_15">
                  <span>驾驶证：</span>
                  <div style={{display: 'inline-grid'}}>
                    {set({
                        name: 'driver_license_1',
                        value: infoData?.verify_material?.driver_license_1,
                    },(valSet)=>(
                        <AvatarBox img_ref={ref => {img_ref = ref}} valSet={valSet} imgs={infoData?.verify_material?.driver_license_1}/>
                    ))}
                    {set({
                        name: 'driver_license_2',
                        value: infoData?.verify_material?.driver_license_2,
                    },(valSet)=>(
                        <AvatarBox img_ref={ref => {img_ref = ref}} valSet={valSet} imgs={infoData?.verify_material?.driver_license_2}/>
                    ))}
                  </div>
                </div>
              </div>:
              <Forms.Item>
                <span style={{marginLeft: "30px", display: "inline-block", width: "100px",textAlign: "right"}}>微信昵称： </span>
                <Inputs style={{ width: 150 }} disabled={true} form={form} name="user_name" value={infoData?.user_name}/>
                <span style={{marginLeft: "30px", display: "inline-block", width: "100px",textAlign: "right"}}>注册手机号： </span>
                <Inputs style={{ width: 150 }} disabled={true} form={form} name="phone" value={infoData?.phone}/>
              </Forms.Item>)}
            </div>
            <div style={{ position: 'absolute', right: 0, bottom: 10, width: '100%', borderTop: '1px solid #e9e9e9', padding: '10px 16px', background: '#fff', textAlign: 'left', }}>
              {creatBtn(submit)}
            </div>
					</div>)
				}}
			</Form>
			<BrandModal/>
		</div>
	);
}
