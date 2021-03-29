import React, { useState, useEffect } from "react";
import { Form as Forms, Button, Select, Cascader, InputNumber } from "antd";
import { Method, Form, Inputs, Uploadimgs, Btn, Modals } from "../comlibs";
 
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

  useEffect(()=>{},[]);
  
  let AvatarBox = (props) => {
    let imgs = props?.imgs || "";
    let [avatar,setAvatar] = useState(imgs);
    let {valSet}=props;
    let {
      uploadimgs,
      url = "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/9cf01460-fc79-11ea-ae54-00163e0e1996.png"
    }={};
    return (
        <div className="mb_10 dis_ib mt_20">
            {avatar ? <img style={{width:400, height:220}} src={avatar}/> :
                <img style={{width:400,height:220}} src={url}/>}
            <div className='dis_ib' style={{width: 180, float: 'right', marginTop: '144px', paddingLeft: '20px'}}>
              <span>上传尺寸：690px*360px</span>
              <Button type='primary' onClick={()=>{ uploadimgs.open() }} style={{marginTop: '20px'}}>上传图片</Button>
            </div>
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

	return (
		<div className="bg_white h_full">
			<Form
        style={{width: "970px", margin: "0 auto"}}
				onSubmit={async (values, btn, ext) => {
          if (parent?.banner_uuid) {
            values.banner_uuid = parent?.banner_uuid;
            let rs = await $.post('/banner/update', values, () => {
              btn.loading = false;
            });
          } else {
            let rs = await $.post('/banner/add', values, () => {
              btn.loading = false;
            });
          }
          $.msg("banner添加成功！");
          props.Parent.close(true);
          return;
				}}
			>
				{({ form, submit, set }) => {
					return (<div>
            <div style={{ marginLeft: 108 }} className="mt_15">
              图片：
              {set({
                  name: 'banner_cover',
                  required: true,
                  value: parent?.banner_cover,
              },(valSet)=>(
                  // <AvatarBox img_ref={ref => {img_ref = ref}} valSet={valSet} imgs={infoData?.verify_material?.company_license}/>
                  <AvatarBox img_ref={ref => {img_ref = ref}} valSet={valSet} imgs={parent?.banner_cover} />
              ))}
            </div>
            <div className="mt_15">
              <span className="dis_ib ta_r mw_150">标题：</span>
              <Inputs style={{ width: 400 }} form={form} name="banner_title" required={true} value={parent?.banner_title}/>
            </div>
            <div className="mt_15">
              <span className="dis_ib mw_150 ta_r">链接类型：</span>
              <Inputs name="link_type" form={form} required={true} type="radio" value={parent?.link_type} radios={[
                {text: '无链接', value: 'NULL'},
                {text: 'H5', value: 'H5'},
                {text: '小程序', value: 'XCX'},
              ]} />
            </div>
            <div className="mt_15">
              <span className="dis_ib mw_150 ta_r">链接地址：</span>
              <Inputs style={{ width: 400 }} form={form} name="link_url" required={form.getFieldValue("link_type") !== 'NULL'} value={parent?.link_url}/>
              <div style={{marginLeft: 152}}>h5的链接地址必须是jikaejia.com的域名才可正常访问</div>
            </div>
            <div className="mt_15">
              <span className="dis_ib mw_150 ta_r">排序：</span>
              {set({
                  name: 'sort',
                  value: parent?.sort,
                  required: true
              },(valSet)=>(
                <InputNumber style={{ width: 400 }} min={1} max={9999} placeholder='数字越大排名越靠前' />
              ))}
            </div>
            <div style={{ position: 'absolute', right: 0, bottom: 10, width: '100%', borderTop: '1px solid #e9e9e9', padding: '10px 16px', background: '#fff', textAlign: 'left', }}>
              <Btn type="default" className='mr_15' onClick={() => props.Parent.close()}> 取消 </Btn>
              <Btn type="primary" htmlType="submit">保存</Btn>
            </div>
					</div>)
				}}
			</Form>
		</div>
	);
}
