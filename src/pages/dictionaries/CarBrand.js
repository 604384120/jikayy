import React, { useState, useEffect } from 'react';
import { Divider, Table, Cascader } from "antd";
import { $, Form, Modals, Inputs, Btn, Uploadimgs } from "../comlibs";

export default function() {
  let {addBrand, series}={};
  let [tablelist, setTableList]=useState([]);
  let [marketList, setMarketList]=useState([]);
  let [truckList, setTruckList]=useState([]);
  let [limit, setLimit]=useState(10);
  let [page, setPage]=useState(1);
  let [total, setTotal]=useState(0);

  useEffect(()=>{getList();getMarketList();getTruckList()},[]);

  async function getList(pag, pageSize){
    let res= await $.get('/brand/query', {page: pag ? pag : page, limit});
    if(!res.data)return;
    let list = res.data.map((node) => {node.children = node.seriess; return node});
    setTableList(list);
    setTotal(res.totalnum);
    pag && setPage(pag);
  };
  
  async function getMarketList(){
    let res = await $.get('/marketcat/query');
    let list = res.data.map((node) => {node.value = node.marketcat_uuid ; node.text = node.marketcat_name; return node});
    setMarketList(list);
  };

  async function getTruckList(){
    let res = await $.get('/truck/cat1/query');
    let list = res.category.map((node) => {node.value = node.cat1 ; node.label = node.name1; node.children = node.cat2s.map((item) => {item.value = item.cat2 ; item.label = item.name2; return item}); return node});
    setTruckList(list);
  };

  async function deleteData(record){
    await $.get('/series/remove',{series_uuid:record.series_uuid});
    $.msg("操作成功~");
    getList();
  };

  let AvatarBox=(props)=>{
    let imgs = props?.brand_logo || props?.series_cover || "";
    let [avatar,setAvatar] = useState(imgs);
    let {valSet}=props;
    let {
      uploadimgs,
      url = "https://sxzimgs.oss-cn-shanghai.aliyuncs.com/yingxiao/page/07ec91c0-e3ad-11ea-8ba7-00163e04cc20.png"
    }={};
    return (
        <div style={{width:'40%'}} className="box box-ver box-ac box-pc">
            {avatar ? <div style={{margin:"-20px 0 0 100px"}} onClick={()=>{ uploadimgs.open() }}>
                <img style={{width:80,height:60}} className="circle" src={avatar}/>
            </div> :
            <div style={{margin:"-20px 0 0 100px", backgroundColor: "#F5F5F5", lineHeight: "60px", textAlign: "center", width: "80px", height: "60px", border: "1px dashed rgb(161, 161, 161)"}} onClick={()=>{ uploadimgs.open() }}>
                <img style={avatar ? {width: 80, height: 60} : {width:12,height:12}} className="circle" src={url}/>
            </div>}
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
}

	let BrandModal = () => {
		return (
			<Modals ref={(rs) => addBrand = rs}>
        {(props) => {
          let setting = props.type === "set" ? "set" : null;
          return (
            <Form
            action={setting ? "/brand/update" : "/brand/add"}
            params={{
              brand_uuid: props?.brand_uuid ? props?.brand_uuid : undefined
            }}
            method="POST"
            success={() => {
              setting ? $.msg("品牌修改成功") : $.msg("品牌添加成功");
              addBrand.close();
              getList();
            }}
          >
            {({ form, set, submit }) => (
              <div>
                <div style={{ marginLeft: 110 }} className="mt_15">
                  品牌logo：
                  {set({
                      name: 'brand_logo',
                      value: props?.brand_logo,
                      // required: setting ? false : true
                  },(valSet)=>(
                      <AvatarBox valSet={valSet} brand_logo={props?.brand_logo} type="brand_logo" />
                  ))}
                </div>
                <div style={{ marginLeft: 110 }} className="mt_15">
                    品牌名称：
                    <Inputs
                      className="input_wrap"
                      form={form}
                      name="brand_name"
                      value={props.brand_name}
                      required={setting ? false : true}
                      placeholder="请输入品牌名称"
                    />
                  </div>
                <div className="ta_c mt_15">
                  <Btn onClick={submit} />
                </div>
              </div>
            )}
          </Form>
          )}
        }
			</Modals>
		);
  };
  
	let SeriesModal = () => {
		return (
			<Modals ref={(rs) => series = rs}>
				{(props) => {
          let setting = props.type === "set" ? "set" : null;
					return <Form
            onSubmit={async (values, btn, ext) => {
              values.brand_uuid = props?.brand_uuid;
              values.truck_cat = values.truck_cat.join('');
              let rs = await $.post(setting ? "/series/update" : "/series/add", {...values, series_uuid: props?.series_uuid});
              setting ? $.msg("车系修改成功") : $.msg("车系添加成功");
              series.close();
              btn.loading = false;  //关闭提交按钮loading加载状态
              getList();
          }}
					>
						{({ form, set, submit }) => {
              let truckValue = props?.truck_cat?.length === 3 ? [props?.truck_cat.substr(0, 1), props?.truck_cat.substr(1)] : [props?.truck_cat];
							return <div>
                <div style={{ marginLeft: 100 }} className="mt_15">
                  车系预览图：
                  {set({
                      name:'series_cover',
                      value: props?.series_cover,
                      // required: setting ? false : true
                  },(valSet)=>(
                      <AvatarBox valSet={valSet} series_cover={props?.series_cover}/>
                  ))}
                </div>
								<div style={{ marginLeft: 110 }} className="mt_15">
                  车系名称：
									<Inputs
										className="input_wrap"
										form={form}
                    name="series_name"
                    value={props?.series_name}
										required={setting ? false : true}
										placeholder="请输入车系名称"
									/>
								</div>
								<div style={{ marginLeft: 110 }} className="mt_15">
                  用途类别：
                  {set({
                      name:'truck_cat',
                      value: setting ? truckValue : undefined,
                      required: setting ? false : true
                  },(valSet)=>{
                    return <Cascader options={truckList} style={{width: "190px"}} onChange={(value) => valSet("truck_cat", value)} placeholder="请选择类别" />
                  })}
                  
								</div>
								<div style={{ marginLeft: 110 }} className="mt_15">
                  细分市场：
									<Inputs name="marketcat_uuid" value={props.marketcat_uuid} placeholder="请选择" form={form} select={marketList} required={setting ? false : true}/>
								</div>
								<div className="ta_c mt_15">
									<Btn onClick={submit} />
								</div>
							</div>
            }}
					</Form>
				}}
			</Modals>
		);
	};

  let columns=[
    	{
			title: "品牌",
			dataIndex: "brand_name"
		},
		{
      title: "车系",
      dataIndex: "series_name",
			render: (text, record) => {
        if (text) {
          return text
        } else {
          return <span>-</span>
        }
      }
    },
    	{
			title: "操作",
			width: 220,
			align:'center',
			render: (text, record) => {
        if (record.children) {
          return (<span>
            <a onClick={() => series.open("车系", {...record, type: "add"})}>添加车系</a>
            <Divider type="vertical" />
            <a onClick={() => addBrand.open("修改品牌", {...record, type: "set"})}>修改</a>
            <Divider type="vertical" />
            <a
              style={record.is_hot === "YES" ? {color: "#999999"} : undefined}
              onClick={async () => {
                let api = "/brand/set/hot";
                record.is_hot === "YES" && (api = "/brand/unset/hot");
                let res = await $.post(api, {brand_uuid: record.brand_uuid});
                getList();
                $.msg("操作成功~");
                return res;
              }}
            >
              {record.is_hot === "YES" ? "取消推荐" : "推荐"}
            </a>
          </span>)
        } else {
          return (
            <div>
                <span className="link" onClick={()=> series.open('修改车系', {...record, type: "set"})}>修改</span>
                <span className="mh_5">|</span>
                <span className="link fc_err" onClick={()=>{deleteData(record)}}>删除</span>
            </div>
          )
        }
			}
		}
  ];

	return (
		<div className="br_3 bg_white pall_15">
      <Btn style={{marginTop: "-20px"}} onClick={() => addBrand.open("品牌", {type: "add"} )}>添加品牌</Btn>
      <Table
        bordered
        className="minH"
        dataSource={tablelist}
        columns={columns}
        rowKey={(rs) => rs._id}
        scroll = {{ x: "max-content" }}
        pagination={{
          current: page,
          pageSize: limit,
          size: "middle",
          total: total,
          showTotal: () => `共${total}条`,
          onChange: getList
        }}
      />
      <BrandModal/>
			<SeriesModal />
		</div>
	);
}
