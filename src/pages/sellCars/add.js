import React, { useState, useEffect } from "react";
import { Form as Forms, Table, Select, Cascader, Icon } from "antd";
import { Method, Form, Inputs, Uploadimgs, Btn, Dropdown } from "../comlibs";
 
const { Option } = Select;
export default function(props) {
  let $ = new Method();
  const Iconfont = $.icon();
  let infoData = props.Parent.data;
  let {img_ref, marketcatDs = false} = {};
  
  let AvatarBox = ({imgs, valSet}) => {
    let [avatar, setAvatar] = useState(imgs ? [...imgs] : []);
    let {
      uploadimgs,
      url = "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/07ec91c0-e3ad-11ea-8ba7-00163e04cc20.png"
    }={};
    const handleDelete = (index) => {
      let ava = [...avatar];
      ava.splice(index, 1);
      setAvatar([...ava]);
      valSet(ava.toString());
    };
    return (
        <div className="uploadImgBox">
            {avatar.length > 0 ? <div style={{margin:"-20px 0 0 0"}}>
              <span style={{background: `url(${url}) no-repeat center`, width:120, height: 90, border: "1px dashed rgb(161, 161, 161)", margin: "5px", float: "left"}} onClick={()=>{ uploadimgs.open() }}></span>
              {avatar?.map((node, index) => {
                return <span className="pst_rel dis_ib pall_5">
                  <img style={{width:120,height:90}} key={index} src={node}/>
                  <Iconfont type="icon-guanbi" className="deleteImg" onClick={() => handleDelete(index)}></Iconfont>
                </span>
              })}
            </div> :
            <div className="uploadDisImg" onClick={()=>{ uploadimgs.open() }}>
                <img style={avatar.length > 0 ? {width: 120, height: 90} : {width:14,height:14}} className="circle" src={url}/>
            </div>}
            <Uploadimgs
              ref={img_ref}
              prefix='newtruck/'
              // multiple={true}
              ref={e => (uploadimgs = e)}
              onSure={cover => {
                setAvatar(avatar.concat(cover.split(",")));
                valSet(avatar.concat(cover.split(",")).join(","));
                // valSet(cover)
                // setAvatar(cover)
              }}
            />
        </div>
    )
  };

	return (
		<div className="br_3 pall_15">
			<Form
        style={{width: "970px", margin: "0 auto"}}
				onSubmit={async values => {
          values.truck_uuid = infoData?.truck_uuid;
          values.brand_uuid = values.brandData[0];
          values.series_uuid = values.brandData[1];
          values.imgs = Array.isArray(values.imgs) ? values.imgs : ([].concat(values.imgs?.split(",")));
          if (infoData) {
            let rs = await $.post('/truck/update', values);
            $.msg("车辆修改成功！");
          } else {
            let rs = await $.post('/truck/add', values);
            $.msg("车辆添加成功！");
          }
          props.Parent.close(true);
          return;
				}}
			>
				{({ form, submit, set }) => {
					return (<div>
            <div className="bg_white pall_15 mb_20">
              <div style={{borderBottom: "1px solid #E9E9E9", padding: "0px 0 12px 20px", fontWeight: "bold", fontSize: "15px", marginBottom: "14px"}}>车型信息</div>
              <Forms.Item>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>
                  <span className="fc_err ph_5">*</span>
                  品牌： 
                </span>
                <div style={{display: "inline-block", width: "150px"}}>
                  {set({
                    name: 'brandData',
                    value: infoData ? [infoData?.brand_uuid, infoData?.series_uuid] : undefined,
                    required: true
                  },(valSet)=>(
                    <Cascader options={props.brandList} onChange={(value) => {
                      let marketcat_uuid;
                      props.brandList.forEach(node => {
                        if (node.brand_uuid === value[0]) {
                          node.seriess.forEach(item => {
                            if (item.series_uuid === value[1]) {
                              marketcat_uuid = item.marketcat_uuid
                            }
                          })
                        }
                      })
                      form.setFieldsValue({"marketcat_uuid": marketcat_uuid})
                      marketcatDs = true
                    }} placeholder="全部品牌/车系" />
                  ))}
                </div>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>
                  <span className="fc_err ph_5">*</span>
                  细分市场： 
                </span>
                {set({
                    name: 'marketcat_uuid',
                    value: infoData ? infoData?.marketcat_uuid : (form.getFieldValue("marketcat_uuid") ? form.getFieldValue("marketcat_uuid") : undefined),
                },(valSet)=>{
                  return <Select style={{ width: 150 }} disabled={marketcatDs}>
                    {props.marketcatList.map((node, index) => {
                      return <Option value={node.marketcat_uuid} key={index}>{node.marketcat_name}</Option>
                    })}
                  </Select>
                })}
                {/* <Inputs style={{ width: 150 }} disabled form={form} name="marketcat_uuid" required={true} value={infoData?.marketcat_uuid || form.getFieldValue("marketcat_uuid")} select={props.marketcatList} /> */}
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>
                  <span className="fc_err ph_5">*</span>
                  车型： 
                </span>
                <Inputs style={{ width: 150 }} form={form} name="car_model" value={infoData?.car_model}/>
              </Forms.Item>
              <Forms.Item>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>公告型号： </span>
                <Inputs style={{ width: 150 }} form={form} name="announcement_model" value={infoData?.announcement_model}/>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>驱动形式： </span>
                <Inputs style={{ width: 150 }} form={form} name="drive_form" value={infoData?.drive_form}/>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>轴距(mm)： </span>
                <Inputs style={{ width: 150 }} form={form} name="wheelbase" value={infoData?.wheelbase}/>
              </Forms.Item>
              <Forms.Item>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>车身长度(米)： </span>
                <Inputs style={{ width: 150 }} form={form} name="body_length" value={infoData?.body_length}/>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>车身宽度(米)： </span>
                <Inputs style={{ width: 150 }} form={form} name="partnership_width" value={infoData?.partnership_width}/>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>前轮距(mm)： </span>
                <Inputs style={{ width: 150 }} form={form} name="front_track" value={infoData?.front_track}/>
              </Forms.Item>
              <Forms.Item>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>后轮距(mm)： </span>
                <Inputs style={{ width: 150 }} form={form} name="rear_track" value={infoData?.rear_track}/>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>整车重量(吨)： </span>
                <Inputs style={{ width: 150 }} form={form} name="vehicle_weight"  value={infoData?.vehicle_weight}/>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>总质量(吨)： </span>
                <Inputs style={{ width: 150 }} form={form} name="total_mass" value={infoData?.total_mass}/>
              </Forms.Item>
              <Forms.Item>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>牵引总质量(吨)： </span>
                <Inputs style={{ width: 150 }} form={form} name="total_mass_of_traction" value={infoData?.total_mass_of_traction}/>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>最高车速(KM/h)： </span>
                <Inputs style={{ width: 150 }} form={form} name="maximum_speed" value={infoData?.maximum_speed}/>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>变数箱(KM/h)： </span>
                <Inputs style={{ width: 150 }} form={form} name="variable_box" value={infoData?.variable_box}/>
              </Forms.Item>
              <Forms.Item>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>吨位级别： </span>
                <Inputs style={{ width: 150 }} form={form} name="tonnage_class" value={infoData?.tonnage_class}/>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>售卖区域： </span>
                <Inputs style={{ width: 150 }} form={form} name="sales_area" value={infoData?.sales_area}/>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>产地： </span>
                <Inputs style={{ width: 150 }} form={form} name="origin" value={infoData?.origin}/>
              </Forms.Item>
              <Forms.Item>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>
                  <span className="fc_err ph_5">*</span>
                  裸车价格(万)： 
                </span>
                <Inputs style={{ width: 150 }} form={form} name="price" required={true} value={infoData?.price}/>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>
                  <span className="fc_err ph_5">*</span>
                  库存数量(辆)： 
                </span>
                <Inputs style={{ width: 150 }} form={form} name="inventory" required={true} value={infoData?.inventory}/>
              </Forms.Item>
              <Forms.Item>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>备注： </span>
                <Inputs style={{ width: "calc(100% - 284px)" }} rows={4} form={form} type="textArea" name="remarks" value={infoData?.remarks}/>
              </Forms.Item>
              <div style={{ marginLeft: 110 }} className="mt_15">
                照片：
                {set({
                    name: 'imgs',
                    value: infoData?.imgs,
                },(valSet)=>(
                    <AvatarBox img_ref={ref => {img_ref = ref}} valSet={valSet} imgs={infoData?.imgs}/>
                ))}
              </div>
            </div>
            <div className="bg_white pall_15 mb_20">
              <div style={{borderBottom: "1px solid #E9E9E9", padding: "0px 0 12px 20px", fontWeight: "bold", fontSize: "15px", marginBottom: "14px"}}>发动机</div>
              <Forms.Item>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>发动机： </span>
                <Inputs style={{ width: 150 }} form={form} name="engine" value={infoData?.engine} />
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>发动机品牌： </span>
                <Inputs style={{ width: 150 }} form={form} name="engine_brand" value={infoData?.engine_brand} />
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>气缸数： </span>
                <Inputs style={{ width: 150 }} form={form} name="number_of_cylinders" value={infoData?.number_of_cylinders} />
              </Forms.Item>
              <Forms.Item>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>燃料种类： </span>
                <Inputs style={{ width: 150 }} form={form} name="fuel_type" value={infoData?.fuel_type} />
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>气缸排列形式： </span>
                <Inputs style={{ width: 150 }} form={form} name="cylinder_classification_form" value={infoData?.cylinder_classification_form} />
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>排量(L)： </span>
                <Inputs style={{ width: 150 }} form={form} name="displacement" value={infoData?.displacement} />
              </Forms.Item>
              <Forms.Item>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>排放标准： </span>
                <Inputs style={{ width: 150 }} name="emission_standards" type="select" form={form} value={infoData?.emission_standards}
                  select={[
                      {value:'国六',text:'国六'},
                      {value:'国五',text:'国五'},
                      {value:'国四',text:'国四'},
                      {value:'国三',text:'国三'},
                  ]}
                />
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>最大马力(马力)： </span>
                <Inputs style={{ width: 150 }} form={form} name="maximum_horsepower" value={infoData?.maximum_horsepower} />
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>最大输出功率(KW)： </span>
                <Inputs style={{ width: 150 }} form={form} name="maximum_output_power" value={infoData?.maximum_output_power} />
              </Forms.Item>
              <Forms.Item>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>扭矩(N-m)： </span>
                <Inputs style={{ width: 150 }} form={form} name="budget" value={infoData?.budget} />
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>最大扭矩转速： </span>
                <Inputs style={{ width: 150 }} form={form} name="maximum_budget" value={infoData?.maximum_budget} />
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>额定转速(RPM)： </span>
                <Inputs style={{ width: 150 }} form={form} name="rating" value={infoData?.rating} />
              </Forms.Item>
            </div>
            <div className="bg_white pall_15 mb_20">
              <div style={{borderBottom: "1px solid #E9E9E9", padding: "0px 0 12px 20px", fontWeight: "bold", fontSize: "15px", marginBottom: "14px"}}>驾驶室参数</div>
              <Forms.Item>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>驾驶室： </span>
                <Inputs style={{ width: 150 }} form={form} name="cab" value={infoData?.cab} />
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>准乘人员(人)： </span>
                <Inputs style={{ width: 150 }} form={form} name="passenger" value={infoData?.passenger} />
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>座位排数： </span>
                <Inputs style={{ width: 150 }} form={form} name="number_of_seats" value={infoData?.number_of_seats} />
              </Forms.Item>
            </div>
            <div className="bg_white pall_15 mb_20">
              <div style={{borderBottom: "1px solid #E9E9E9", padding: "0px 0 12px 20px", fontWeight: "bold", fontSize: "15px", marginBottom: "14px"}}>变速箱</div>
              <Forms.Item>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>变速箱： </span>
                <Inputs style={{ width: 150 }} form={form} name="gearbox" value={infoData?.gearbox} />
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>变速箱品牌： </span>
                <Inputs style={{ width: 150 }} form={form} name="gearbox_brand" value={infoData?.gearbox_brand} />
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>换挡方式： </span>
                <Inputs style={{ width: 150 }} form={form} name="shift_mode" value={infoData?.shift_mode} />
              </Forms.Item>
              <Forms.Item>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>倒挡数(个)： </span>
                <Inputs style={{ width: 150 }} form={form} name="number_of_reverse_gears" value={infoData?.number_of_reverse_gears} />
              </Forms.Item>
            </div>
            <div className="bg_white pall_15 mb_20">
              <div style={{borderBottom: "1px solid #E9E9E9", padding: "0px 0 12px 20px", fontWeight: "bold", fontSize: "15px", marginBottom: "14px"}}>轮胎</div>
              <Forms.Item>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>轮胎数(个)： </span>
                <Inputs style={{ width: 150 }} form={form} name="number_of_tires" value={infoData?.number_of_tires}/>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>轮胎规格： </span>
                <Inputs style={{ width: 150 }} form={form} name="tire_specifications" value={infoData?.tire_specifications}/>
              </Forms.Item>
            </div>
            <div className="bg_white pall_15 mb_20">
              <div style={{borderBottom: "1px solid #E9E9E9", padding: "0px 0 12px 20px", fontWeight: "bold", fontSize: "15px", marginBottom: "14px"}}>底盘</div>
              <Forms.Item>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>前桥描述： </span>
                <Inputs style={{ width: 150 }} form={form} name="front_axle_description" value={infoData?.front_axle_description}/>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>后桥描述： </span>
                <Inputs style={{ width: 150 }} form={form} name="rear_axle_description" value={infoData?.rear_axle_description}/>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>后桥允许荷载(KG)： </span>
                <Inputs style={{ width: 150 }} form={form} name="allow_blood_sugar_on_the_rear_axle" value={infoData?.allow_blood_sugar_on_the_rear_axle}/>
              </Forms.Item>
              <Forms.Item>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>前桥允许荷载(KG)： </span>
                <Inputs style={{ width: 150 }} form={form} name="front_bridge_allows_blood_sugar" value={infoData?.front_bridge_allows_blood_sugar}/>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>后桥速比： </span>
                <Inputs style={{ width: 150 }} form={form} name="rear_axle_speed_ratio" value={infoData?.rear_axle_speed_ratio}/>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>弹簧片数： </span>
                <Inputs style={{ width: 150 }} form={form} name="number_of_springs" value={infoData?.number_of_springs}/>
              </Forms.Item>
              <Forms.Item>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>鞍座： </span>
                <Inputs style={{ width: 150 }} form={form} name="saddle" value={infoData?.saddle}/>
              </Forms.Item>
            </div>
            <div className="bg_white pall_15 mb_20">
              <div style={{borderBottom: "1px solid #E9E9E9", padding: "0px 0 12px 20px", fontWeight: "bold", fontSize: "15px", marginBottom: "14px"}}>操控配置</div>
              <Forms.Item>
                <span style={{marginLeft: "30px", display: "inline-block", width: "130px",textAlign: "right"}}>ABS防抱死： </span>
                <Inputs
                  name="abs_anti_lock"
                  form={form}
                  type="radio"
                  value={infoData?.abs_anti_lock}
                  radios={[
                    {
                      value: "standard",
                      text: "标配",
                    },
                    {
                      value: "optional",
                      text: "选配",
                    },
                    {
                      value: "no",
                      text: "无",
                    },
                  ]}
                />
              </Forms.Item>
            </div>
            <div className="ta_c mt_15">
              <Btn
                className="mt_15"
                htmlType="submit"
                style={{ width: 65 }}
              >
                确定
              </Btn>
            </div>
					</div>)
				}}
			</Form>
			
		</div>
	);
}
